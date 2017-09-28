import * as React from 'react';
import { Attachment, CardAction, KnownMedia, UnknownMedia } from 'botframework-directlinejs';
import { renderIfNonempty, IDoCardAction } from './Chat';
import { FormatState } from './Store';
import { AdaptiveCardContainer } from './AdaptiveCardContainer';
import * as konsole from './Konsole';
import { promote } from 'botframework-adaptivecardsbuilder';

const regExpCard = /\^application\/vnd\.microsoft\.card\./i;

const YOUTUBE_DOMAIN = "youtube.com";
const YOUTUBE_WWW_DOMAIN = "www.youtube.com";
const YOUTUBE_SHORT_DOMAIN = "youtu.be";
const YOUTUBE_WWW_SHORT_DOMAIN = "www.youtu.be";
const VIMEO_DOMAIN = "vimeo.com";
const VIMEO_WWW_DOMAIN = "www.vimeo.com";

export interface QueryParams {
    [propName: string]: string;
}

export const queryParams = (src: string) =>
    src
    .substr(1)
    .split('&')
    .reduce((previous, current) => {
        const keyValue = current.split('=');
        previous[decodeURIComponent(keyValue[0])] = decodeURIComponent(keyValue[1]);
        return previous;
    }, {} as QueryParams);

const queryString = (query: QueryParams) =>
    Object.keys(query)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(query[key].toString()))
    .join('&');

const exists = (value: any) => value != null && typeof value != "undefined";

const Youtube = (props: {
    embedId: string,
    autoPlay?: boolean,
    loop?: boolean
}) =>
    <iframe
        src={ `https://${YOUTUBE_DOMAIN}/embed/${props.embedId}?${queryString({
            modestbranding: '1',
            loop: props.loop ? '1' : '0',
            autoplay: props.autoPlay ? '1' : '0'
        })}` }
    />;

const Vimeo = (props: {
    embedId: string,
    autoPlay?: boolean,
    loop?: boolean
}) =>
    <iframe
        src={ `https://player.${VIMEO_DOMAIN}/video/${props.embedId}?${queryString({
            title: '0',
            byline: '0',
            portrait: '0',
            badge: '0',
            autoplay: props.autoPlay ? '1' : '0',
            loop: props.loop ? '1' : '0'
        })}` }
    />;

interface VideoProps {
    src: string,
    poster?: string,
    autoPlay?:boolean,
    loop?: boolean,
    onLoad?: () => void,
    onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

const Video = (props: VideoProps ) => {
    const url = document.createElement('a');
    url.href = props.src;
    const urlQueryParams = queryParams(url.search);
    const pathSegments = url.pathname.substr(1).split('/');
    switch (url.hostname) {
        case YOUTUBE_DOMAIN:
        case YOUTUBE_SHORT_DOMAIN:
        case YOUTUBE_WWW_DOMAIN:
        case YOUTUBE_WWW_SHORT_DOMAIN:
            return <Youtube
                embedId={ url.hostname === YOUTUBE_DOMAIN || url.hostname === YOUTUBE_WWW_DOMAIN ? urlQueryParams['v'] : pathSegments[pathSegments.length-1] }
                autoPlay={ props.autoPlay }
                loop={ props.loop }
            />;

        case VIMEO_WWW_DOMAIN:
        case VIMEO_DOMAIN:
            return <Vimeo
                embedId={ pathSegments[pathSegments.length-1] }
                autoPlay={ props.autoPlay }
                loop={ props.loop }
            />

        default:
            return <video controls { ... props } />
    }
}

const Media = (props: {
    src: string,
    type?: 'image' | 'video' | 'audio',   // defaults to 'image'
    poster?: string,
    autoPlay?:boolean,
    loop?: boolean,
    onLoad?: () => void,
    onClick?: (e: React.MouseEvent<HTMLElement>) => void
}) => {
    switch (props.type) {
        case 'video':
            return <Video { ...props as VideoProps }  />
        case 'audio':
            return <audio controls { ... props } />;
        default:
            return <img { ... props } />;
    }
}

const Unknown = (props: {
    format: FormatState,
    contentType: string,
    contentUrl: string,
    name: string
}) => {
    if (regExpCard.test(props.contentType)) {
        return <span>{ props.format.strings.unknownCard.replace('%1', props.contentType) }</span>;
    } else if (props.contentUrl) {
        return <span><a href={ props.contentUrl } title={ props.contentUrl } target='_blank'>{ props.name || props.format.strings.unknownFile.replace('%1', props.contentType) }</a></span>;
    } else {
        return <span>{ props.format.strings.unknownFile.replace('%1', props.contentType) }</span>;
    }
}

const mediaType = (url: string) =>
    url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase() == 'gif' ? 'image' : 'video';

export const AttachmentView = (props: {
    format: FormatState;
    attachment: Attachment,
    onCardAction: IDoCardAction,
    onImageLoad: () => void
}) => {
    if (!props.attachment) return;
    const attachment = props.attachment as KnownMedia;
    const onCardAction = (cardAction: CardAction) => cardAction &&
        ((e: React.MouseEvent<HTMLElement>) => {
            props.onCardAction(cardAction.type, cardAction.value);
            e.stopPropagation();
        });
    const attachedImage = (
        images: {
            url: string,
            tap?: CardAction // deprecated field for Skype channels. For testing legacy bots in Emulator only.
        }[]
    ) => images && images.length > 0 &&
        <Media src={ images[0].url } onLoad={ props.onImageLoad } onClick={ onCardAction(images[0].tap) } />;

    const adaptiveCardJSON = promote(
        attachment,
        {
            format: {
                strings: {
                    receiptTax: props.format.strings.receiptTax,
                    receiptTotal: props.format.strings.receiptTotal,
                    receiptVat: props.format.strings.receiptVat
                }
            }
        }
    );

    switch (attachment.contentType) {
        case "application/vnd.microsoft.card.hero":
            return (
                adaptiveCardJSON &&
                    <AdaptiveCardContainer
                        card={ adaptiveCardJSON }
                        className="hero"
                        onCardAction={ props.onCardAction }
                        onClick={ onCardAction(attachment.content.tap) }
                        onImageLoad={ props.onImageLoad }
                    />
            );

        case "application/vnd.microsoft.card.thumbnail":
            return (
                adaptiveCardJSON &&
                    <AdaptiveCardContainer
                        card={ adaptiveCardJSON }
                        className="thumbnail"
                        onCardAction={ props.onCardAction }
                        onClick={ onCardAction(attachment.content.tap) }
                        onImageLoad={ props.onImageLoad }
                    />
            );

        case "application/vnd.microsoft.card.video":
            return (
                adaptiveCardJSON &&
                    <AdaptiveCardContainer
                        card={ adaptiveCardJSON }
                        className="video"
                        onCardAction={ props.onCardAction }
                    >
                        <Media
                            autoPlay={ attachment.content.autostart }
                            loop={ attachment.content.autoloop }
                            onLoad={ props.onImageLoad }
                            poster={ attachment.content.image && attachment.content.image.url }
                            src={ attachment.content.media[0].url }
                            type="video"
                        />
                    </AdaptiveCardContainer>
            );


        case "application/vnd.microsoft.card.animation":
            return (
                adaptiveCardJSON &&
                    <AdaptiveCardContainer
                        card={ adaptiveCardJSON }
                        className="animation"
                        onCardAction={ props.onCardAction }
                    >
                        <Media
                            autoPlay={ attachment.content.autostart }
                            loop={ attachment.content.autoloop }
                            onLoad={ props.onImageLoad }
                            poster={ attachment.content.image && attachment.content.image.url }
                            src={ attachment.content.media[0].url }
                            type={ mediaType(attachment.content.media[0].url) }
                        />
                    </AdaptiveCardContainer>
            );

        case "application/vnd.microsoft.card.audio":
            return (
                adaptiveCardJSON &&
                    <AdaptiveCardContainer
                        card={ adaptiveCardJSON }
                        className="audio"
                        onCardAction={ props.onCardAction }
                    >
                        <Media
                            autoPlay={ attachment.content.autostart }
                            loop={ attachment.content.autoloop }
                            src={ attachment.content.media[0].url }
                            type="audio"
                        />
                    </AdaptiveCardContainer>
            );

        case "application/vnd.microsoft.card.signin":
            return (
                adaptiveCardJSON &&
                    <AdaptiveCardContainer
                        className="signin"
                        card={ adaptiveCardJSON }
                        onCardAction={ props.onCardAction }
                    />
            );

        case "application/vnd.microsoft.card.receipt":
            return (
                adaptiveCardJSON &&
                    <AdaptiveCardContainer
                        className="receipt"
                        card={ adaptiveCardJSON }
                        onCardAction={ props.onCardAction }
                        onClick={ onCardAction(attachment.content.tap) }
                    />
            );

        case "application/vnd.microsoft.card.adaptive":
            return (
                !!attachment.content &&
                    <AdaptiveCardContainer
                        card={ attachment.content }
                        onImageLoad={ props.onImageLoad }
                        onCardAction={ props.onCardAction }
                    />
            );

        // Deprecated format for Skype channels. For testing legacy bots in Emulator only.
        case "application/vnd.microsoft.card.flex":
            return (
                adaptiveCardJSON &&
                    <AdaptiveCardContainer
                        card={ adaptiveCardJSON }
                        className="flex"
                        onCardAction={ props.onCardAction }
                    >
                        { attachedImage(attachment.content.images) }
                    </AdaptiveCardContainer>
            );

        case "image/png":
        case "image/jpg":
        case "image/jpeg":
        case "image/gif":
            return <Media src={ attachment.contentUrl } onLoad={ props.onImageLoad } />;

        case "audio/mpeg":
        case "audio/mp4":
            return <Media type="audio" src={ attachment.contentUrl } />;

        case "video/mp4":
            return <Media type="video" poster={ attachment.thumbnailUrl } src={ attachment.contentUrl } onLoad={ props.onImageLoad } />;

        default:
            const unknownAttachment = props.attachment as UnknownMedia;

            return <Unknown format={ props.format } contentType={ unknownAttachment.contentType } contentUrl={ unknownAttachment.contentUrl } name={ unknownAttachment.name } />;
    }
}
