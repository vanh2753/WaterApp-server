import axios from "./axios";

const recordErrorMeter = async (serial_number, customer_name, address, meter_book_number, meter_value) => {
    const res = await axios.post("/record-error-meter", { serial_number, customer_name, address, meter_book_number, meter_value });
    return res.data;
}

const getJobList = async () => {
    const res = await axios.get('/get-job-list')
    return res.data
}

const handleflushing = async (job_id, status) => {
    console.log('Status:', status);
    const res = await axios.post(`/handle-flushing/${job_id}`, { status })
    return res.data
}

const completeMeterReplacement = async (job_id, serial_number) => {
    try {
        console.log('Serial number:', serial_number);
        const res = await axios.post(`/complete-meter-replacement/${job_id}`, { serial_number })
        return res.data
    } catch (error) {
        console.log('check errr', error)
    }
}

const updatedInSystem = async (job_id) => {
    const res = await axios.post(`/updated-in-system/${job_id}`, {})
    return res.data
}

const completeProjectDocument = async (job_id) => {
    const res = await axios.post(`/complete-project-document/${job_id}`, {})
    return res.data
}

const recordEmergencyReplacement = async (job_id, serial_number) => {
    //todo
}

const getJobHistory = async () => {
    const res = await axios.get('/get-job-history')
    return res.data
}
export { recordErrorMeter, getJobList, handleflushing, completeMeterReplacement, updatedInSystem, completeProjectDocument, recordEmergencyReplacement, getJobHistory }