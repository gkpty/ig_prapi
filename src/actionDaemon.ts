import executeActions from './executeActions'

const actionDaemon = async (limit=50) => {
  setTimeout(async () => {
    await executeActions(limit).catch(err=>{throw new Error(err)})
  }, 3600000)
}

export default actionDaemon