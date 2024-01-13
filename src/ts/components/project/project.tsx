import React, { 
    ReactNode,
    useState,
} from "react";

enum projectStateEnum {
    Closed,
    Open
}

export default function Project({
    srcSlug,
    alt,
    title,
    subtitle,
    children,
    btn_href
}: {
    srcSlug?: string,
    alt?: string,
    title: string,
    subtitle?: string,
    children?: ReactNode,
    btn_href: string,
}) {

    const [projectState, setProjectState] = useState(projectStateEnum['Closed']);
    let classes = projectState === projectStateEnum['Closed'] ? '' : 'expanded';
    classes += ' project';

    function projectExpand() {
        setProjectState(projectStateEnum['Open']);
    }

    function projectRevert() {
        setProjectState(projectStateEnum['Closed']);
    }

    return (<>
        <article className={classes} 
            onClick={() => projectExpand()} 
            onMouseLeave={() => projectRevert()}
            // onMouseLeave={(e: Evt) => projectRevert(e)}
            aria-expanded={projectState === projectStateEnum['Open'] ? true : false}
            >
            { 
                <picture>
                    <source srcSet={`assets/media/${srcSlug}.png.webp`} type="image/webp"/>
                    <source srcSet={`assets/media/${srcSlug}.png`} type="image/png"/>
                    <img src={`assets/media/${srcSlug}.png.webp`} alt={alt ?? ""}  />
                </picture>
            }

            <div className="content">
                <h3>{ title } <span>{ subtitle }</span></h3>
                { children }
                <a className="btn" href={ btn_href } target="_blank">
                    Visit { title }
                </a>
            </div>
        </article>
    </>);
}