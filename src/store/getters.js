const getters = {
  isMobile: state => state.app.isMobile,
  lang: state => state.app.lang,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  currentMission: state => state.mission.currentMission,
  currentMissionInfo: state => state.mission.currentMission.missionInfo,
  teamMembers: state => state.mission.currentMission.teamMembers,
  onlineMembers: state => state.mission.currentMission.onlineTeamMembers,
  faceRecognitionHistory: state => state.mission.currentMission.faceRecognitionHistory,
  im: state => state.im,
  messageList: state => state.im.currentMessageList,
  messageListCompleted: state => state.im.isCompleted
}

export default getters
