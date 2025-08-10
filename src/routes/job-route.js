const router = require('express').Router()
const { recordErrorMeter,
    getJobList,
    handleflushing,
    getPendingInspectionJobs,
    completeMeterReplacement,
    recordEmergencyReplacement,
    getCompletedReplacementJobs } = require('../controllers/job-controller')

router.post('/record-error-meter', recordErrorMeter)
router.get('/get-job-list', getJobList)
router.get('/get-pending-inspection-jobs', getPendingInspectionJobs)
router.post('/record-emergency-replacement', recordEmergencyReplacement)
router.get('/get-completed-replacement-jobs', getCompletedReplacementJobs)
router.post('/handle-flushing/:job_id', handleflushing)
router.post('/complete-meter-replacement/:job_id', completeMeterReplacement)

module.exports = router