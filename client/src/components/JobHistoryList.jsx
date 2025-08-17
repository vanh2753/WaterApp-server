import Table from 'react-bootstrap/Table';
import { getJobHistory } from '../api/job-api';
import { useState, useEffect } from 'react';
const JobHistoryList = () => {

    const [jobData, setJobData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const res = await getJobHistory()
            setJobData(res.DT)
        }
        fetchData()
    }, [])

    const renderStatus = (status) => {
        if (status === 'Mới') {
            return <span className="tag text-primary">{status}</span>;
        }
        if (status === 'Xúc xả thành công' || status === 'Đã cập nhật hệ thống' || status === "Hoàn thiện hồ sơ") {
            return <span className="tag text-success">{status}</span>;
        }
        if (status === 'Xúc xả thất bại') {
            return <span className="tag text-danger">{status}</span>;
        }
        if (status === 'Chờ Thanh tra') {
            return <span className="tag text-warning">{status}</span>;
        }
        if (status === 'Đã thay thế') {
            return <span className="tag text-info">{status}</span>;
        }
        return <span className="tag">{status}</span>;
    }

    return (
        <div className='p-md-3'>
            <h3 className='text-center mt-3'>Lịch sử công việc</h3>
            <div className='table-responsive px-2'>
                <Table bordered hover className='w-100'>
                    <thead>
                        <tr className=''>
                            <th className='text-center'>Mã việc</th>
                            <th className='text-center'>Trạng thái</th>
                            <th>Bộ phận phụ trách</th>
                            <th>Nhân viên phụ trách</th>
                            <th className='text-center'>Thời gian</th>
                        </tr>
                    </thead>
                    {
                        jobData.map((job, index) => {
                            return (
                                <tbody>
                                    <tr key={index} className="align-middle">
                                        <td className='text-center'>{job.job_id}</td>
                                        <td className='text-center'>{renderStatus(job.status)}</td>
                                        <td>{job.task_type}</td>
                                        <td>{job?.User?.full_name}</td>
                                        <td>{new Date(job.createdAt).toLocaleString('vi-VN')} </td>
                                    </tr>
                                </tbody>
                            )
                        })
                    }
                </Table>
            </div>
        </div>
    )
}

export default JobHistoryList