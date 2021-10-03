// WordPress dependencies.
import { CheckboxControl, TextControl } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withSelect, withDispatch } from "@wordpress/data";
import * as React from "react";
import { Fragment } from "react";
import { addFilter } from "@wordpress/hooks";

// This basically simply renders the check and text boxes. And the 'isVideo &&'
// means if the checkbox is checked, we show the text box. Otherwise, it's hidden.
function FeaturedVideoToggle({
	// These two props are passed by applyWithSelect().
	isVideo,
	videoUrl,
	// Whereas these are passed by applyWithDispatch().
	onSetIsVideo,
	onSetVideoUrl,
}) {
	return (
		<>
			<CheckboxControl
				label="Replace thumbnail with YouTube ideo"
				checked={isVideo}
				onChange={onSetIsVideo}
			/>
			{isVideo && <TextControl value={videoUrl} onChange={onSetVideoUrl} />}
		</>
	);
}

// Whenever the post is edited, this would be called. And we use it to pass the
// updated metadata to the above function.
const applyWithSelect = withSelect((select) => {
	const { getEditedPostAttribute } = select("core/editor");
	const meta: any = getEditedPostAttribute("meta");

	return {
		isVideo: meta._featured_image_is_video,
		videoUrl: meta._featured_image_video_url,
	};
});

// Whenever the post is edited, this would also be called. And we use it to update
// the metadata through the above function. But note that the changes would only
// be saved in the database when you click on the submit button, e.g. the "Update"
// button on the post editing screen. :)
const applyWithDispatch = withDispatch((dispatch) => {
	const { editPost } = dispatch("core/editor");
	return {
		onSetIsVideo(isVideo: any) {
			const meta = { _featured_image_is_video: isVideo };
			editPost({ meta });
		},
		onSetVideoUrl(videoUrl: any) {
			const meta = { _featured_image_video_url: videoUrl };
			editPost({ meta });
		},
	};
});

// And finally, 'compose' the above functions.
export default compose(applyWithSelect, applyWithDispatch)(FeaturedVideoToggle);


/// Add featured image to PostFeaturedImage 
function wrapPostFeaturedImage(OriginalComponent) {
	console.log("org", OriginalComponent)
	return function (props) {
		return [
			Fragment,
			// Show a custom heading
			<h4>Options</h4>,
			// ..then the original featured image element
			<OriginalComponent {...props} />,
			// ..then our custom checkbox and text box.
			<FeaturedVideoToggle isVideo={false} videoUrl="" onSetVideoUrl={undefined} onSetIsVideo={undefined} />,
		];
	};
}

addFilter(
	"editor.PostFeaturedImage",
	"webpress/featured-image-as-video",
	wrapPostFeaturedImage
);
