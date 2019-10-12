import CMS from 'netlify-cms-app'
// import uploadcare from 'netlify-cms-media-library-uploadcare'
// import cloudinary from 'netlify-cms-media-library-cloudinary'

import AboutPagePreview from './preview-templates/AboutPagePreview'
import BlogPostPreview from './preview-templates/BlogPostPreview'
import ChampionshipPreview from './preview-templates/ChampionshipPreview'
import EventPreview from "./preview-templates/EventPreview"
import ProductPagePreview from './preview-templates/ProductPagePreview'
import IndexPagePreview from './preview-templates/IndexPagePreview'
import RoutePreview from "./preview-templates/RoutePreview"
import SessionPreview from "./preview-templates/SessionPreview"
import VenuePreview from "./preview-templates/VenuePreview"

// CMS.registerMediaLibrary(uploadcare)
// CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('index', IndexPagePreview)
CMS.registerPreviewTemplate('about', AboutPagePreview)
CMS.registerPreviewTemplate('products', ProductPagePreview)
CMS.registerPreviewTemplate('blog', BlogPostPreview)
CMS.registerPreviewTemplate('events', EventPreview)
CMS.registerPreviewTemplate('championships', ChampionshipPreview)
CMS.registerPreviewTemplate('venues', VenuePreview)
CMS.registerPreviewTemplate('routes', RoutePreview)
CMS.registerPreviewTemplate('sessions', SessionPreview)
