import cocoaDialog from 'cocoa-dialog'
import Q from 'q'

class DialogController {

  static error(title, message) {
    cocoaDialog('ok-msgbox', {
      title: title,
      icon: 'caution',
      text: title,
      noCancel: true,
      informativeText: message
    })
  }

  static input(title, action) {
    const deferred = Q.defer();
    cocoaDialog('inputbox', {
      title: title,
      button1: action,
      button2: 'Cancel'
    }).then(result => {
      let data = result.split('\n')
      if(data[0] == '1')
        deferred.resolve(data[1]);
    })
    return deferred.promise
  }

}

module.exports = DialogController
