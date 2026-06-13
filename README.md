# VoiceExt

A Chrome extension that lets you **post bilibili danmaku (弹幕) by voice**. Hold a hotkey, speak, and your speech is transcribed with the Web Speech API and sent as a scrolling comment on the video you are watching.

## How it works

1. On a `bilibili.com/video/*` page, a content script (`get_aid_cid.js`) grabs the video's `aid`/`cid` and the background page redirects to the Flash player (`static-s.bilibili.com/play.swf?cid=...`), where the extension's UI is injected.
2. Hold the bind key (default **S**, keycode 83) as a push-to-talk button. `recognition.js` starts a `webkitSpeechRecognition` session (continuous + interim results).
3. When a phrase is finalized, optional **keyword → kaomoji** substitution is applied (`Word2Emoji` in `func_recall.js`, mappings from `bg.js`), and the text is queued.
4. Each queued line shows a flying-danmaku preview (`FlyDanmu`) and appears in a Bootstrap-Table list. After a 5-second grace period it is POSTed to `interface.bilibili.com/dmpost` (see `post_comment.js`); during that window you can edit or re-pick the line with the arrow/Enter keys.

## Files

| File | Role |
| --- | --- |
| `manifest.json` | MV2 manifest: permissions, content scripts, background scripts, popup |
| `get_aid_cid.js` | Content script that reads the video's `aid`/`cid` |
| `bg.js` | Background page: emoji-set generation, bind-key storage, message routing, danmaku POST dispatch |
| `recognition.js` | `webkitSpeechRecognition` wrapper and result handling |
| `post_comment.js` | XHR POST of a danmaku to bilibili's `dmpost` interface |
| `func_recall.js` | In-player UI: the queue table, push-to-talk key handling, edit mode, flying-danmaku preview, microphone animation |
| `addon.js` | `FlyDanmu` preview + `Word2Emoji` keyword substitution |
| `popup/` | Browser-action popup for choosing the kaomoji set per mood category and the bind key |
| `bootstrap*`, `jquery*`, `underscore*` | Bundled vendor libraries |

## Install (developer mode)

1. Open `chrome://extensions`, enable **Developer mode**, and **Load unpacked** this folder.
2. Open a bilibili video, then hold the bind key and speak.

## Notes

This is a legacy project (Manifest V2, `webkitSpeechRecognition`, and bilibili's old Flash `play.swf` player). bilibili has since retired the Flash player and changed the danmaku-posting API, and Chrome no longer loads MV2 extensions, so it is preserved here for reference rather than as a working install. The original moods/kaomoji categories (惊呆了 / 开心 / 无奈 / 大哭 / 卖萌 / 打人 / 掀桌) are configurable from the popup.
