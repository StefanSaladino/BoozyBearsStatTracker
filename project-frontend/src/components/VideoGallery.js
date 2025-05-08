import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Renders a list of video highlights
const VideoGallery = ({ videos }) => {
    return (_jsxs("section", { children: [_jsx("h3", { children: "Highlight Videos" }), videos.length === 0 ? (_jsx("p", { children: "No highlight videos available." })) : (videos.map((video, index) => (_jsxs("div", { children: [video.title && _jsx("p", { children: video.title }), _jsxs("video", { width: "480", controls: true, style: { marginBottom: '1rem' }, children: [_jsx("source", { src: video.url, type: "video/mp4" }), "Your browser does not support the video tag."] })] }, index))))] }));
};
export default VideoGallery;
