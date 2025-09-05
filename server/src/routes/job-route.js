const router = require('express').Router()
const { recordErrorMeter,
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
    exportReportFile } = require('../controllers/job-controller')
const { authenticateToken } = require('../middlewares/authenticateToken')

router.post('/record-error-meter', authenticateToken, recordErrorMeter)
router.get('/get-job-list', authenticateToken, getJobList)
router.get('/get-pending-inspection-jobs', authenticateToken, getPendingInspectionJobs)
router.post('/record-emergency-replacement', authenticateToken, recordEmergencyReplacement)
router.get('/get-completed-replacement-jobs', authenticateToken, getCompletedReplacementJobs)
router.get('/get-job-history', authenticateToken, getJobHistory)
router.get('/get-job-chart-data', authenticateToken, getJobChartData)
router.get('/export-file', exportReportFile)
router.post('/handle-flushing/:job_id', authenticateToken, handleflushing)
router.post('/complete-meter-replacement/:job_id', authenticateToken, completeMeterReplacement)
router.post('/updated-in-system/:job_id', authenticateToken, updatedInSystem)
router.post('/complete-project-document/:job_id', authenticateToken, completeProjectDocument)
router.put("/job/:job_id", authenticateToken, updateJob);

module.exports = router