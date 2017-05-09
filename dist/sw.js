importScripts('sw-toolbox.js');

const config = {
	offlinePage: 'offline.html'
};

config.filesToCache = [
	'/MobNews/LTR/dist/',
	'/MobNews/LTR/dist/index.html',
	'/MobNews/LTR/dist/about-us.html',
	'/MobNews/LTR/dist/news-category.html',
	'/MobNews/LTR/dist/news-detail-carousel-post.html',
	'/MobNews/LTR/dist/news-detail-video-post.html',
	'/MobNews/LTR/dist/news-detail-twitter-post.html',
	'/MobNews/LTR/dist/news-detail-sample-post.html',
	'/MobNews/LTR/dist/contact.html',
	'/MobNews/LTR/dist/services.html',
	'/MobNews/LTR/dist/_comment_form.html',
	'/MobNews/LTR/dist/_contact_form.html',
	'/MobNews/LTR/dist/feature-accordion.html',
	'/MobNews/LTR/dist/feature-ad.html',
	'/MobNews/LTR/dist/feature-anim.html',
	'/MobNews/LTR/dist/feature-audio.html',
	'/MobNews/LTR/dist/feature-news-post-carousel.html',
	'/MobNews/LTR/dist/feature-brightcove.html',
	'/MobNews/LTR/dist/feature-button.html',
	'/MobNews/LTR/dist/feature-carousel.html',
	'/MobNews/LTR/dist/feature-dailymotion.html',
	'/MobNews/LTR/dist/feature-facebook.html',
	'/MobNews/LTR/dist/feature-grid.html',
	'/MobNews/LTR/dist/feature-icons.html',
	'/MobNews/LTR/dist/feature-icon-info-box.html',
	'/MobNews/LTR/dist/feature-iframe.html',
	'/MobNews/LTR/dist/feature-image.html',
	'/MobNews/LTR/dist/feature-image-lightbox.html',
	'/MobNews/LTR/dist/feature-instagram.html',
	'/MobNews/LTR/dist/feature-lightbox.html',
	'/MobNews/LTR/dist/feature-pinterest.html',
	'/MobNews/LTR/dist/feature-social-share.html',
	'/MobNews/LTR/dist/feature-soundcloud.html',
	'/MobNews/LTR/dist/feature-table-responsive.html',
	'/MobNews/LTR/dist/feature-twitter.html',
	'/MobNews/LTR/dist/feature-user-notification.html',
	'/MobNews/LTR/dist/feature-video.html',
	'/MobNews/LTR/dist/feature-vimeo.html',
	'/MobNews/LTR/dist/feature-vine.html',
	'/MobNews/LTR/dist/feature-youtube.html',

	'/MobNews/LTR/dist/manifest.json',
	'/MobNews/LTR/dist/assets/img/google_maps_512x512.png',
	'/MobNews/LTR/dist/assets/img/favicons/apple-touch-icon.png',
	'/MobNews/LTR/dist/assets/img/favicons/favicon-32x32.png',
	'/MobNews/LTR/dist/assets/img/favicons/favicon-16x16.png',
	'/MobNews/LTR/dist/assets/img/favicons/safari-pinned-tab.svg',
	'/MobNews/LTR/dist/assets/img/splashScreens/apple-touch-startup-image-1536x2008.png',
	'/MobNews/LTR/dist/assets/img/splashScreens/apple-touch-startup-image-1242x2148.png',
	'/MobNews/LTR/dist/assets/img/splashScreens/apple-touch-startup-image-750x1294.png',
	'/MobNews/LTR/dist/assets/img/splashScreens/apple-touch-startup-image-640x1096.png',

	'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css'
];

/**
 * Generates a placeholder SVG image of the given size.
 */
function offlineImage(name, width, height) {
	return `<?xml version="1.0"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" version="1.1">
  <g fill="none" fill-rule="evenodd"><path fill="#F8BBD0" d="M0 0h${width}v${height}H0z"/></g>
  <text text-anchor="middle" x="${Math.floor(width / 2)}" y="${Math.floor(height / 2)}">image offline (${name})</text>
<style><![CDATA[
text{
  font: 48px Roboto,Verdana, Helvetica, Arial, sans-serif;
}
]]></style>
</svg>`;
}

/**
 * Returns true if the Accept header contains the given content type string.
 */
function requestAccepts(request, contentType) {
	return request.headers.get('Accept').indexOf(contentType) != -1;
}

/**
 * ampbyexample.com fetch handler:
 *
 * - one-behind caching
 * - shows offline page
 * - generates placeholder image for unavailable images
 */
function ampByExampleHandler(request, values) {
	/* for samples show offline page if offline and samples are not cached */
	if (requestAccepts(request, 'text/html')) {
		return toolbox.fastest(request, values).catch(function () {
			return toolbox.cacheOnly(new Request(config.offlinePage), values);
		});
	}
	/* always try to load images from the cache first */
	/* fallback to placeholder SVG image if offline and image not available */
	if (requestAccepts(request, 'image/')) {
		return toolbox.cacheFirst(request, values).catch(function () {
			const url = request.url;
			const fileName = url.substring(url.lastIndexOf('/') + 1);
			/* TODO use correct image dimensions */
			return new Response(offlineImage(fileName, 1080, 610),
				{headers: {'Content-Type': 'image/svg+xml'}}
			);
		});
	} else {
		/* cache all other requests */
		return toolbox.fastest(request, values);
	}
}

toolbox.options.debug = false;
toolbox.router.default = toolbox.networkOnly;
toolbox.router.get('/(.*)', ampByExampleHandler, {origin: self.location.origin});
toolbox.router.get('/(.*)', toolbox.fastest, {origin: 'https://cdn.ampproject.org'});

toolbox.precache(config.filesToCache);