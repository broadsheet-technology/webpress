// WordPress dependencies.
import { CheckboxControl, TextControl } from "@wordpress/components";
import { createHigherOrderComponent } from "@wordpress/compose";
import * as React from "react";
import { Fragment } from "react";
import { addFilter } from "@wordpress/hooks";
import { useEntityProp } from "@wordpress/core-data";

/**
 * Adds a checkbox and field for overriding the feature image with a video
 *
 * @param {function} PostFeaturedImage Featured Image component.
 *
 * @return {function} PostFeaturedImage Modified Featured Image component.
 */
addFilter(
  "editor.PostFeaturedImage",
  "webpress/featured-image-as-video",
  createHigherOrderComponent(
    (OriginalComponent) =>
      (props: {
        _featured_image_is_video: boolean;
        _featured_image_video_url: string;
      }) => {
        const [meta, setMeta] = useEntityProp("postType", "post", "meta");

        const setFeaturedImageIsVideo = (value) =>
          setMeta(
            Object.assign({}, meta, {
              _featured_image_is_video: value,
            })
          );

        const setFeaturedImageVideoUrl = (value) => {
          setMeta(
            Object.assign({}, meta, {
              _featured_image_video_url: value,
            })
          );
        };

        return (
          <Fragment>
            <OriginalComponent {...props} />
            <FeaturedVideoToggle
              isVideo={meta._featured_image_is_video}
              videoUrl={meta._featured_image_video_url}
              onSetIsVideo={setFeaturedImageIsVideo}
              onSetVideoUrl={setFeaturedImageVideoUrl}
            />
          </Fragment>
        );
      },
    "webpress/featured-image-as-video"
  )
);

function FeaturedVideoToggle({
  isVideo,
  videoUrl,
  onSetIsVideo,
  onSetVideoUrl,
}) {
  return (
    <>
      <CheckboxControl
        label="Replace with YouTube Video?"
        checked={isVideo}
        onChange={onSetIsVideo}
      />
      {isVideo && <TextControl value={videoUrl} onChange={onSetVideoUrl} />}
    </>
  );
}
