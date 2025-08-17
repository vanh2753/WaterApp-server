const { Model } = require('sequelize')
const { Job, JobHistory, User, Notificationm, Meter } = require('../models')
const recordErrorMeter = async (req, res, next) => {
    try {
        const { serial_number, customer_name, address, meter_book_number, meter_value } = req.body
        const responsible_user_id = req.user.user_id

        const meter_old = await Meter.findOne({ where: { serial_number: serial_number } })
        if (!meter_old) {
            return res.status(400).json({
                EC: 1,
                EM: "Đồng hồ không tồn tại trong hệ thống"
            })
        }

        const errorForm = {
            status: 'Mới',
            task_type: 'Ghi thu',
            responsible_user_id: responsible_user_id,
            meter_id_old: meter_old.id,
            customer_name: customer_name,
            address: address,
            meter_book_number: meter_book_number,
            meter_value: meter_value
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

const getJobList = async (req, res, next) => {
    try {
        const jobs = await Job.findAll({
            include: [
                {
                    model: Meter,
                    as: 'OldMeter',
                    attributes: ['serial_number']
                },
                {
                    model: User,
                    attributes: ['user_id', 'full_name']
                }
            ],
            order: [['job_id', 'DESC']]
        })
        return res.status(200).json({
            EC: 0,
            EM: "Lấy danh sách toàn bộ công việc",
            DT: jobs
        })
    } catch (error) {
        next(error)
    }
}

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
        const newMeter = await Meter.findOne({ where: { serial_number: serial_number } })
        if (!newMeter) {
            return res.status(400).json({
                EC: 1,
                EM: "Vui lòng kiểm tra lại serial đồng hồ"
            })
        }

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
    //todo
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
        const jobHistory = await JobHistory.findAll({
            order: [['createdAt', 'DESC']],
            include: [{
                model: User,
                attributes: ["user_id", "full_name"]
            }]
        })
        return res.status(200).json({
            EC: 0,
            EM: "Lấy danh sách lịch sử",
            DT: jobHistory
        })
    } catch (error) {
        next(error)
    }
}

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
    getJobHistory
}
