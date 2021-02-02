import executeActions from './executeActions'

const actionDaemon = async (limit=50) => {
  setTimeout(async () => {
    await executeActions(limit)
  }, 3600000)
}

export default actionDaemon