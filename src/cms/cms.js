import CMS from 'netlify-cms-app'
// import uploadcare from 'netlify-cms-media-library-uploadcare'
// import cloudinary from 'netlify-cms-media-library-cloudinary'

import StandardPagePreview from './preview-templates/StandardPagePreview'
import BlogPostPreview from './preview-templates/BlogPostPreview'
import ChampionshipPreview from './preview-templates/ChampionshipPreview'
import CommitteePagePreview from './preview-templates/CommitteePagePreview'
import EventPreview from './preview-templates/EventPreview'
import IndexPagePreview from './preview-templates/IndexPagePreview'
import RoutePreview from './preview-templates/RoutePreview'
import SessionPreview from './preview-templates/SessionPreview'
import VenuePreview from './preview-templates/VenuePreview'

// CMS.registerMediaLibrary(uploadcare)
// CMS.registerMediaLibrary(cloudinary)

CMS.registerPreviewTemplate('index', IndexPagePreview)
CMS.registerPreviewTemplate('about', StandardPagePreview)
CMS.registerPreviewTemplate('committee', CommitteePagePreview)
CMS.registerPreviewTemplate('londonMarathonPlace', StandardPagePreview)
CMS.registerPreviewTemplate('rules', StandardPagePreview)
CMS.registerPreviewTemplate('blog', BlogPostPreview)
CMS.registerPreviewTemplate('events', EventPreview)
CMS.registerPreviewTemplate('championships', ChampionshipPreview)
CMS.registerPreviewTemplate('venues', VenuePreview)
CMS.registerPreviewTemplate('routes', RoutePreview)
CMS.registerPreviewTemplate('sessions', SessionPreview)
CMS.registerPreviewTemplate('joinFirstClaimSuccess', StandardPagePreview)
CMS.registerPreviewTemplate('joinSecondClaimSuccess', StandardPagePreview)
CMS.registerPreviewTemplate('joinCancel', StandardPagePreview)
CMS.registerPreviewTemplate('renewFirstClaimSuccess', StandardPagePreview)
CMS.registerPreviewTemplate('renewSecondClaimSuccess', StandardPagePreview)
CMS.registerPreviewTemplate('renewCancel', StandardPagePreview)
CMS.registerPreviewTemplate('checkoutSuccess', StandardPagePreview)
CMS.registerPreviewTemplate('checkoutCancel', StandardPagePreview)
