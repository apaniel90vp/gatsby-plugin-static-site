
// We override loadPage & loadPagesync to fix canonical redirects
// we also override hovering to disable hover prefetch
exports.onClientEntry = () => {
  const loader = window.___loader;

  // if there is no loader we shouldn't do anything (gatsby doesn't expose loader on develop)
  if (!loader) {
    return;
  }

  const pagePath = window.pagePath;
  const location = window.location;

  if (pagePath !== location.pathname && pagePath !== location.pathname + '/') {
    const originalLoadPageSync = loader.loadPageSync;
    const originalLoadPage = loader.loadPage;

    loader.loadPageSync = path => {
      // if the path is the same as our current page we know it's not a prefetch
      if (path === location.pathname) {
        return originalLoadPageSync(pagePath);
      }

      return originalLoadPageSync(path);
    }
    loader.loadPage = path => {
      // if the path is the same as our current page we know it's not a prefetch
      if (path === location.pathname) {
        return originalLoadPage(pagePath);
      }

      return originalLoadPage(path);
    }
  }

  // disable hovering prefetching as we don't know if we can.
  loader.hovering = () => { };
}

// we also need to disable prefetching as we don't know the exact page-data path.
// TODO look at prefetch a whole html page on hover?
exports.disableCorePrefetching = () => true