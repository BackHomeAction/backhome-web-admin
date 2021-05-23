export function arrayChange (dataUse) {
  console.log(dataUse)
  var ChangeData = [{
    title: '',
    address: '',
    choose: 0
  }]
  ChangeData[0].title = dataUse.title
  ChangeData[0].address = dataUse.address
  ChangeData[0].choose = 0
  return ChangeData
}
