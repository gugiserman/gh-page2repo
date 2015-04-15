(function() {

  function UpdateURLMessage(data) {
    data = data || {};

    this.url = data.url ? data.url : null;
    this.type = 'ghp2r.updateUrl';
  }

  function GithubPage2Repo() {
    this.isValid = false;
    this.isActive = false;

    this.type = null;
    this.handle = null;
    this.repo = null;

    this.url = null;

    this.validate();

    if (this.isValid) {
      this.mount();
      this.enable();
    }
    else {
      this.disable();
    }
  }

  GithubPage2Repo.prototype.validate = function() {
    var isValid = false;
    if ( !location.hostname.match(/github\./) ) {
      return false;
    }

    this.type = (function() {
      switch ( location.hostname.match(/github\.io|github\.com/)[0] ) {
        case 'github.io':
          return 'page';
        default:
          return 'repo';
      }
    }());

    if (this.type) {
      isValid = true;
    }

    return this.isValid = isValid;
  };

  GithubPage2Repo.prototype.mount = function() {
    var url= location.protocol + '//';

    if (this.type === 'page') {
      this.handle = location.hostname.split('.')[0];
      this.repo = ( (!location.pathname || location.pathname === '/') ? ('/' + location.hostname) : location.pathname );

      url += ( 'github.com/' + this.handle + this.repo );

    } else {
      var splitPath = location.pathname.split('/');
      this.handle = splitPath[1];
      this.repo = (location.hostname.match(/github\.com/) && !(location.pathname.split('/').length > 2)) ? '' : splitPath[2];

      if ( this.repo.match(/\.github\.io/) ) {
        url += this.repo;
      } else {
        url += ( this.handle + '.github.io/' + this.repo );
      }
    }

    return this.url = url;
  };

  GithubPage2Repo.prototype.enable = function() {
    chrome.runtime.sendMessage( new UpdateURLMessage({ url: this.url }) );
  };

  GithubPage2Repo.prototype.disable = function() {
    chrome.runtime.sendMessage( new UpdateURLMessage() );
  };

  return new GithubPage2Repo();

}());
