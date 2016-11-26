'use strict';

SwaggerEditor.controller('OpenExamplesCtrl', function OpenExamplesCtrl($scope,
  $uibModalInstance, $rootScope, $state, FileLoader, Builder, Storage,
  Analytics, defaults) {
  $scope.files = defaults.exampleFiles;
  $scope.selectedFile = defaults.exampleFiles[0];

  $scope.open = function(file) {
    var url = defaults.examplesFolder + file;

    FileLoader.loadFromUrl(url).then(function(value) {
      Storage.save('yaml', value);
      $rootScope.editorValue = value;
      $state.go('home', {tags: null});
      $uibModalInstance.close();
    }, $uibModalInstance.close);

    Analytics.sendEvent('open-example', 'open-example:' + file);
  };

  $scope.cancel = $uibModalInstance.close;
});
