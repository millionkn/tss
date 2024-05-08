import { register } from "module";
import sourceMapSupport from '@cspotcode/source-map-support';

console.log(99999)

sourceMapSupport.install({
  environment: 'node',
  retrieveFile(pathOrUrl) {
    debugger
    console.log('path',pathOrUrl) 
    throw new Error()
  },
  
  redirectConflictingLibrary: true,
  onConflictingLibraryRedirect(request, parent, isMain, options, redirectedRequest) {
    debugger
  },
})

register('./loader.js', import.meta.url)