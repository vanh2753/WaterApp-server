const { Model } = require('sequelize')
const { Job, JobHistory, User, Notification, Meter, sequelize } = require('../models')
const ExcelJS = require("exceljs");
const path = require('path');

const { Op } = require('sequelize');
const recordErrorMeter = async (req, res, next) => {
    try {
        const { serial_number, customer_name, address, meter_book_number, meter_value, meter_status, note } = req.body
        const responsible_user_id = req.user.user_id

        const meter_old = await Meter.create({ serial_number, customer_name, address, status: meter_status, note: meter_status === "Khác" ? note : null })

        const errorForm = {
            status: 'Mới',
            task_type: 'Ghi thu',
            responsible_user_id: responsible_user_id,
            meter_id_old: meter_old.meter_id,
            customer_name: customer_name,
            address: address,
            meter_book_number: meter_book_number,
            meter_value: meter_value,

        }

        const job = await Job.create(errorForm)

        if (job) {
            await JobHistory.create({ job_id: job.job_id, status: 'Mới', task_type: 'Ghi thu', responsible_user_id: responsible_user_id })
        }

        return res.status(201).json({
            EC: 0,
            EM: "Ghi nhận lỗi Mới",
            DT: job
        })
    } catch (error) {
        next(error)
    }
}

const updateJob = async (req, res, next) => {
    try {
        const { job_id } = req.params; // lấy từ URL: /api/job/:job_id
        const { serial_number, customer_name, address, meter_book_number, meter_value, meter_status, note } = req.body;
        const responsible_user_id = req.user.user_id;

        // 1. Kiểm tra Job có tồn tại không
        const job = await Job.findByPk(job_id);
        if (!job) {
            return res.status(404).json({
                EC: 1,
                EM: "Không tìm thấy công việc"
            });
        }

        // 2. Kiểm tra đồng hồ theo serial_number
        const meter = await Meter.create({ serial_number, customer_name, address, status: meter_status, note: meter_status === "Khác" ? note : null });

        // 4. Update job
        await job.update({
            customer_name,
            address,
            meter_book_number,
            meter_value,
            meter_id_old: meter.meter_id, // gắn lại đồng hồ
        });

        return res.status(200).json({
            EC: 0,
            EM: "Cập nhật công việc thành công",
            DT: job
        });
    } catch (error) {
        next(error);
    }
};



const getJobList = async (req, res, next) => {
    try {
        let { page } = req.query;
        page = parseInt(page) || 1;
        const limit = 15;
        const offset = (page - 1) * limit;

        const { role } = req.user;

        const queryOptions = {
            include: [
                {
                    model: Meter,
                    as: "OldMeter",
                    attributes: ["serial_number", "status", "note"],
                },
                {
                    model: Meter,
                    as: "NewMeter",
                    attributes: ["serial_number", "status", "note"],
                },
                {
                    model: User,
                    attributes: ["user_id", "full_name"],
                },
            ],
            order: [["job_id", "DESC"]],
            offset,
            limit,
        };

        switch (role) {
            case "TP":
                break;
            case "GT":
                queryOptions.where = {
                    status: {
                        [Op.in]: ["Mới", "Hoàn thiện hồ sơ", "Xúc xả thành công"]
                    }
                };
                break;
            case "QLM":
                queryOptions.where = { status: "Mới" };
                break;
            case "TT":
                queryOptions.where = { status: "Chờ Thanh tra" };
                break;
            case "KD":
                queryOptions.where = { status: "Đã thay thế" };
                break;
            case "KT":
                queryOptions.where = {
                    status: {
                        [Op.in]: ["Đã cập nhật hệ thống", "Hoàn thiện hồ sơ", "Đã thay thế"]
                    }
                };
                break;
            default:
                return res.status(403).json({
                    EC: 1,
                    EM: "Role không hợp lệ",
                    DT: [],
                });
        }

        const { rows: jobs, count } = await Job.findAndCountAll(queryOptions);

        return res.status(200).json({
            EC: 0,
            EM: "Lấy danh sách công việc thành công",
            DT: jobs,
            pagination: {
                page,
                limit,
                totalRecords: count,
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (error) {
        next(error);
    }
};


const handleflushing = async (req, res, next) => {
    try {
        const { job_id } = req.params
        const { status } = req.body
        const responsible_user_id = req.user.user_id

        const job = await Job.findOne({ where: { job_id: job_id } })
        if (!job) {
            return res.status(400).json({
                EC: 1,
                EM: "Không tìm thấy công việc"
            })
        }

        if (status === 'Xúc xả thất bại') {
            await job.update({ status: 'Chờ Thanh tra', task_type: 'Thanh tra', responsible_user_id: responsible_user_id })
            await JobHistory.create({ job_id: job.job_id, status: 'Chờ Thanh tra', task_type: 'Thanh tra', responsible_user_id: responsible_user_id })
            return res.status(200).json({
                EC: 0,
                EM: "Xúc xả thất bại",
                DT: job
            })
        }

        if (status === 'Xúc xả thành công') {
            await job.update({ status: status, task_type: 'QL Mạng', responsible_user_id: responsible_user_id })
            await JobHistory.create({ job_id: job.job_id, status: 'Xúc xả thành công', task_type: 'QL Mạng', responsible_user_id: responsible_user_id })
            return res.status(200).json({
                EC: 0,
                EM: "Xúc xả thành công",
                DT: job
            })
        }

    } catch (error) {
        next(error)
    }
}

const getPendingInspectionJobs = async (req, res, next) => {
    try {
        const jobs = await Job.findAll({ where: { status: 'Chờ Thanh tra' } })
        return res.status(200).json({
            EC: 0,
            EM: "Lấy danh sách công việc chờ thanh tra",
            DT: jobs
        })
    } catch (error) {
        next(error)
    }
}

const completeMeterReplacement = async (req, res, next) => {
    try {
        const { job_id } = req.params
        const { serial_number } = req.body
        const responsible_user_id = req.user.user_id

        const job = await Job.findOne({ where: { job_id: job_id } })
        if (!job) {
            return res.status(400).json({
                EC: 1,
                EM: "Không tìm thấy công việc"
            })
        }
        const newMeter = await Meter.create({ serial_number, status: 'Sử dụng' })

        await job.update({ meter_id_new: newMeter.meter_id, status: 'Đã thay thế', task_type: 'Thanh tra', responsible_user_id: responsible_user_id })
        await JobHistory.create({ job_id: job.job_id, status: 'Đã thay thế', task_type: 'Thanh tra', responsible_user_id: responsible_user_id })

        return res.status(200).json({
            EC: 0,
            EM: "Hoàn thành công việc thay thế",
            DT: job
        })
    } catch (error) {
        next(error)
    }
}

const recordEmergencyReplacement = async (req, res, next) => {
    try {
        const { serial_number, new_serial, customer_name, address, meter_book_number, meter_value, meter_status, note } = req.body
        const responsible_user_id = req.user.user_id

        // tìm đồng hồ cũ
        const meter_old = await Meter.create({ serial_number, serial_number, status: meter_status, customer_name, address, note: meter_status === "Khác" ? note : null })

        // tìm đồng hồ mới
        const meter_new = await Meter.create({ serial_number: new_serial, status: "Sử dụng" })

        // tạo công việc thay thế khẩn cấp
        const errorForm = {
            status: 'Đã thay thế',
            task_type: 'Thanh tra',
            responsible_user_id,
            meter_id_old: meter_old.meter_id,
            meter_id_new: meter_new.meter_id,
            customer_name,
            address,
            meter_book_number,
            meter_value,
            emergency_replacement: true
        }

        const job = await Job.create(errorForm)

        if (job) {
            await JobHistory.create({
                job_id: job.job_id,
                status: 'Đã thay thế',
                task_type: 'Thanh tra',
                responsible_user_id
            })
        }

        return res.status(201).json({
            EC: 0,
            EM: "Ghi nhận thay thế khẩn cấp thành công",
            DT: job
        })
    } catch (error) {
        next(error)
    }
}


const getCompletedReplacementJobs = async (req, res, next) => {
    try {
        const jobs = await Job.findAll({ where: { status: 'Đã thay thế' } })
        return res.status(200).json({
            EC: 0,
            EM: "Lấy danh sách công việc đã hoàn thành",
            DT: jobs
        })
    } catch (error) {
        next(error)
    }
}

const updatedInSystem = async (req, res, next) => {
    try {
        const { job_id } = req.params
        const responsible_user_id = req.user.user_id

        const job = await Job.findOne({ where: { job_id: job_id } })
        if (!job) {
            return res.status(400).json({
                EC: 1,
                EM: "Không tìm thấy công việc"
            })
        }

        await job.update({ status: "Đã cập nhật hệ thống", task_type: "Kinh doanh", responsible_user_id: responsible_user_id })
        await JobHistory.create({ job_id: job.job_id, status: "Đã cập nhật hệ thống", task_type: "Kinh doanh", responsible_user_id: responsible_user_id })

        return res.status(200).json({
            EC: 0,
            EM: "Đã cập nhật hệ thống",
            DT: job
        })
    } catch (error) {
        next(error)
    }
}

const completeProjectDocument = async (req, res, next) => {
    try {
        const { job_id } = req.params
        const responsible_user_id = req.user.user_id

        const job = await Job.findOne({ where: { job_id: job_id } })
        if (!job) {
            return res.status(400).json({
                EC: 1,
                EM: "Không tìm thấy công việc"
            })
        }

        await job.update({ status: "Hoàn thiện hồ sơ", task_type: "Kỹ thuật", responsible_user_id: responsible_user_id })
        await JobHistory.create({ job_id: job.job_id, status: "Hoàn thiện hồ sơ", task_type: "Kỹ thuật", responsible_user_id: responsible_user_id })
        return res.status(200).json({
            EC: 0,
            EM: "Hoàn thiện hồ sơ thành công",
            DT: job
        });
    } catch (error) {
        next(error)
    }
}

const getJobHistory = async (req, res, next) => {
    try {
        let { page } = req.query;
        page = parseInt(page) || 1; // mặc định page = 1
        const limit = 15;
        const offset = (page - 1) * limit;

        const jobHistory = await JobHistory.findAll({
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                attributes: ["user_id", "full_name"]
            }],
            offset,
            limit
        });

        return res.status(200).json({
            EC: 0,
            EM: "Lấy danh sách lịch sử",
            DT: jobHistory,
            pagination: {
                page,
                limit
            }
        });
    } catch (error) {
        next(error);
    }
};


const getJobChartData = async (req, res) => {
    try {
        const completedStatuses = ['Xúc xả thành công', 'Hoàn thiện hồ sơ'];

        // 1. Tổng số công việc
        const totalJobs = await Job.count();

        // 2. Số công việc hoàn thành
        const completedCount = await Job.count({
            where: { status: { [Op.in]: completedStatuses } }
        });

        const uncompletedCount = totalJobs - completedCount;

        // Chưa hoàn thành theo bộ phận
        const uncompletedJobs = await Job.findAll({
            attributes: [
                [
                    sequelize.literal(`
            CASE 
              WHEN status = 'Mới' THEN 'QL Mạng'
              WHEN status = 'Chờ Thanh tra' THEN 'Thanh tra'
              WHEN status = 'Đã thay thế' THEN 'Kinh doanh'
              WHEN status = 'Đã cập nhật hệ thống' THEN 'Kỹ thuật'
              ELSE 'Khác'
            END
          `),
                    'department'
                ],
                [sequelize.fn('COUNT', sequelize.col('job_id')), 'count']
            ],
            where: { status: { [Op.notIn]: completedStatuses } },
            group: ['department']
        });

        // Format PieChart
        const pieChart = [
            { name: 'Hoàn thành', value: completedCount },
            { name: 'Chưa hoàn thành', value: totalJobs - completedCount }
        ];

        // Format BarChart
        const barChart = uncompletedJobs.map(u => ({
            department: u.get('department'),
            value: Number(u.get('count'))
        }));

        return res.json({
            EC: 0,
            EM: 'Lấy dữ liệu thành công',
            DT: {
                totalJobs,
                completed: completedCount,
                uncompleted: uncompletedCount,
                pieChart,
                barChart
            }
        });
    } catch (e) {
        console.error(e);
        return res.json({
            EC: 1,
            EM: 'Có lỗi khi lấy dữ liệu',
            DT: {}
        });
    }
};

const getDataForExport = async (req, res, next) => {

    const jobs = await JobHistory.findAll({
        where: { status: "Đã cập nhật hệ thống" },
        include: [
            { model: User, attributes: ["user_id", "full_name"] },
            {
                model: Job,
                include: [
                    {
                        model: Meter,
                        as: "NewMeter",
                        attributes: ["serial_number", "status", "note"]
                    }
                ]
            }
        ]
    });

    return jobs.map(j => ({
        history_id: j.history_id,
        job_id: j.job_id,
        history_status: j.status,
        history_task_type: j.task_type,
        history_createdAt: j.createdAt,
        history_updatedAt: j.updatedAt,

        user_id: j.User?.user_id,
        user_full_name: j.User?.full_name,

        job_status: j.Job?.status,
        job_responsible_user_id: j.Job?.responsible_user_id,
        job_task_type: j.Job?.task_type,
        customer_name: j.Job?.customer_name,
        address: j.Job?.address,
        meter_book_number: j.Job?.meter_book_number,
        meter_value: j.Job?.meter_value,
        failure_reason: j.Job?.failure_reason,
        replacement_serial: j.Job?.replacement_serial,
        emergency_replacement: j.Job?.emergency_replacement,
        photo_url: j.Job?.photo_url,
        job_createdAt: j.Job?.createdAt,
        job_updatedAt: j.Job?.updatedAt,

        new_meter_serial: j.Job?.NewMeter?.serial_number,
        new_meter_status: j.Job?.NewMeter?.status,
        new_meter_note: j.Job?.NewMeter?.note
    }));
}

const exportReportFile = async (req, res) => {
    try {
        const { month, year } = req.query;

        let where = {};
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            where.createdAt = { [Op.between]: [startDate, endDate] };
        }

        const data = await getDataForExport(where);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Báo cáo công việc');

        // Đặt font và wrapText mặc định cho toàn bộ sheet
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                cell.font = { name: 'Times New Roman', size: 11 };
            });
        });

        // Đặt độ rộng cột
        const columnWidths = [6, 10, 15, 15, 20, 15, 20, 15, 15, 15, 25, 15, 20, 30];
        worksheet.columns = columnWidths.map((w) => ({ width: w }));

        // Logo
        const logoPath = path.join(__dirname, '../publics/logo.png');
        const logoId = workbook.addImage({
            filename: logoPath,
            extension: 'png',
        });
        worksheet.addImage(logoId, {
            tl: { col: 0, row: 0 },
            ext: { width: 100, height: 100 }, // giữ tỉ lệ chuẩn (cỡ nhỏ vừa phải)
        });

        // Dòng tiêu đề
        worksheet.mergeCells('C2:H2');
        worksheet.getCell('C2').value = 'BÁO CÁO CÔNG VIỆC';
        worksheet.getCell('C2').font = { bold: true, size: 20 };
        worksheet.getCell('C2').alignment = { vertical: 'middle', horizontal: 'left' };

        worksheet.mergeCells('C3:H3');
        worksheet.getCell('C3').value = 'ĐỘI KDNS BẮC THĂNG LONG';
        worksheet.getCell('C3').font = { bold: true, size: 14, italic: true };
        worksheet.getCell('C3').alignment = { vertical: 'middle', horizontal: 'left' };

        // Header
        const headerRow1 = [
            'STT',
            { name: 'Thông tin công việc', span: 5 },
            { name: 'Thông tin đồng hồ', span: 6 },
            { name: 'Thông tin khách hàng', span: 2 },
        ];
        const headerRow2 = [
            'Mã CV',
            'Bộ phận',
            'Nhân viên',
            'Trạng thái',
            'Ngày',
            'Serial đồng hồ thay thế',
            'Số đọc đồng hồ',
            'Chỉ số đồng hồ',
            'Tình trạng',
            'Ghi chú',
            'Thay thế đột xuất',
            'Họ tên',
            'Địa chỉ',
        ];

        // Hàng 4
        worksheet.mergeCells('A5:A6');
        worksheet.getCell('A5').value = headerRow1[0];
        worksheet.getCell('A5').alignment = { vertical: 'middle', horizontal: 'center' };

        worksheet.mergeCells('B5:F5');
        worksheet.getCell('B5').value = headerRow1[1].name;

        worksheet.mergeCells('G5:K5');
        worksheet.getCell('G5').value = headerRow1[2].name;

        worksheet.mergeCells('L5:N5');
        worksheet.getCell('L5').value = headerRow1[3].name;

        // hàng 6
        headerRow2.forEach((text, index) => {
            worksheet.getRow(6).getCell(index + 2).value = text; // index+2 nghĩa là từ cột B
        });

        // Style header
        worksheet.getRow(5).font = { bold: true };
        worksheet.getRow(6).font = { bold: true };
        worksheet.getRow(5).alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(6).alignment = { vertical: 'middle', horizontal: 'center' };

        // Đổ data
        data.forEach((item, index) => {
            worksheet.addRow([
                index + 1,                             // STT
                item.job_id,                           // Mã CV
                item.history_task_type,                // Bộ phận
                item.user_full_name,                   // Nhân viên
                item.history_status,                   // Trạng thái
                item.job_createdAt.toLocaleDateString('vi-VN'), // Ngày
                item.new_meter_serial,                 // Serial đồng hồ thay thế
                item.meter_book_number,                // Sổ GCS (nếu bạn muốn để đây)
                item.meter_value,                      // Chỉ số đồng hồ
                item.new_meter_status,                 // Tình trạng
                item.new_meter_note || '',             // Ghi chú
                item.emergency_replacement ? 'X' : '', // Thay thế đột xuất
                item.customer_name,                    // Họ tên KH
                item.address                           // Địa chỉ KH
            ]);
        });

        // Kẻ viền toàn bộ bảng
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber >= 5) {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                });
            }
        });

        // Xuất file
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).send('Có lỗi khi xuất file');
    }
};




module.exports = {
    recordErrorMeter,
    getJobList,
    handleflushing,
    getPendingInspectionJobs,
    completeMeterReplacement,
    recordEmergencyReplacement,
    getCompletedReplacementJobs,
    updatedInSystem,
    completeProjectDocument,
    getJobHistory,
    getJobChartData,
    updateJob,
    exportReportFile
}
