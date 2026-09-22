import { PIPELINE_STAGES } from './constants'

// Figures out how far along the main pipeline this application got, even
// if it ultimately ended off-pipeline (Rejected / Withdrawn / On Hold).
export function getPipelineIndex(application) {
  if (PIPELINE_STAGES.includes(application.status)) {
    return PIPELINE_STAGES.indexOf(application.status)
  }

  const timeline = application.timeline || []
  for (let i = timeline.length - 1; i >= 0; i -= 1) {
    if (PIPELINE_STAGES.includes(timeline[i].status)) {
      return PIPELINE_STAGES.indexOf(timeline[i].status)
    }
  }
  return 0
}
