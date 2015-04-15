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

    var domainBlacklist = ['gist', 'help', 'developer', 'status', 'training', 'shop'];
    var dirBlacklist = ['explore', 'blog', 'settings', 'organizations', 'notifications', 'new', 'site', 'contact', 'about'];

    if ( !location.hostname.match(/github\./)
      || domainBlacklist.indexOf(location.hostname.split('.')[0]) !== -1
      || (location.hostname.match(/github\.com/) && dirBlacklist.indexOf(location.pathname.split('/')[1]) !== -1) ) {
      return false;
    }

    this.type = (function() {
      switch ( location.hostname.match(/github\.io|github\.com/)[0] ) {
        case 'github.io':
          return 'page';
        case 'github.com':
          return 'repo';
        default:
          return null;
      }
    }());

    if (this.type) {
      isValid = true;
    }

    return this.isValid = isValid;
  };

  GithubPage2Repo.prototype.mount = function() {
    var url = location.protocol + '//';

    if (this.type === 'page') {
      this.handle = location.hostname.split('.')[0];
      this.repo = ( (!location.pathname || location.pathname === '/') ? ('/' + location.hostname) : location.pathname );

      url += ( 'github.com/' + this.handle + this.repo );

    } else {
      var splitPath = location.pathname.split('/');

      this.handle = splitPath[1];
      this.repo = location.pathname.split('/').length > 2 ? splitPath[2] : '';

      if (!this.handle) {
        if (location.hostname.split('.')[0] === 'pages') {
          url += 'github.com';
        } else {
          url += 'pages.github.com'
        }
      }
      else {
        if ( this.repo.match(this.handle + '.github.io') ) {
          url += this.repo;
        } else {
          url += ( this.handle + '.github.io/' + this.repo );
        }
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
