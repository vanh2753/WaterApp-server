import Table from 'react-bootstrap/Table';
import { getJobList } from '../api/job-api';
import { useEffect, useState } from 'react';
import DetailJobModal from './DetailJobModal';
import { useSelector } from 'react-redux'
import './jobList.scss'
import Button from 'react-bootstrap/Button';

const JobList = () => {
    const [jobData, setJobData] = useState([])
    const [selectedJob, setSlectJob] = useState({})
    const [modalShow, setModalShow] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true) // để check cuối trang

    const user = useSelector(state => state.user.userInfo)
    const role = user.role

    const fetchData = async (pageNum = 1) => {
        const res = await getJobList(pageNum)
        setJobData(res.DT)
        setHasMore(res.DT.length === 10) // nếu ít hơn 10 thì tức là hết data
    }

    const reloadJobList = async () => {
        const res = await getJobList(page)
        setJobData(res.DT)
        setHasMore(res.DT.length === 10)
    }

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
        return <span className="tag">{status}</span>;
    }

    useEffect(() => {
        fetchData(page)
    }, [page])

    return (
        <div className='p-md-3'>
            <h3 className='text-center mt-3'>Danh sách công việc</h3>
            <div className='table-responsive px-2'>
                <Table bordered hover className='w-100'>
                    <thead>
                        <tr className=''>
                            <th className='text-center'>Mã việc</th>
                            <th>Mã đồng hồ lỗi</th>
                            <th>Bộ phận phụ trách</th>
                            <th>Nhân viên phụ trách</th>
                            <th className='text-center'>Trạng thái</th>
                            <th className='text-center'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobData.map((job, index) => (
                            <tr key={index} className="align-middle">
                                <td className='text-center'>{job.job_id}</td>
                                <td>{job.OldMeter.serial_number}</td>
                                <td>{job.task_type}</td>
                                <td>{job?.User?.full_name}</td>
                                <td className='text-center'>{renderStatus(job.status)}</td>
                                <td className='text-center'>
                                    <button className='btn btn-info' onClick={() => { setSlectJob(job); setModalShow(true) }}>Xem</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Nút Prev/Next */}
            <div className="mt-3 d-flex justify-content-center">
                <Button
                    variant="primary"
                    className="me-2 px-3"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </Button>
                <Button
                    variant="primary"
                    className='px-3'
                    disabled={!hasMore}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </Button>
            </div>

            <DetailJobModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                jobData={selectedJob}
                role={role}
                reloadJobList={reloadJobList}
            />
        </div>
    )
}

export default JobList
