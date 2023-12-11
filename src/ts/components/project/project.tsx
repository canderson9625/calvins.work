import React, { 
    ReactNode,
    // useEffect,
    useState,
} from "react";
import { Evt } from '../components';

enum projectStateEnum {
    Closed,
    Open
}

export default function Project(props: {
    img: ReactNode,
    title: string,
    subtitle: string,
    children: ReactNode,
    btn_href: string,
}) {

    const [projectState, setProjectState] = useState(projectStateEnum['Closed']);
    let classes = projectState === projectStateEnum['Closed'] ? '' : 'expanded';
    classes += ' project';

    function projectExpand(e: Evt) {
        setProjectState(projectStateEnum['Open']);
    }

    function projectRevert(e: Evt) {
        setProjectState(projectStateEnum['Closed']);
    }

    // useEffect(() => {
    //     May be used
    //     return () => {
    //          to clean up
    //     }
    // })

    return (<>
        <article className={classes} 
            onClick={(e: Evt) => projectExpand(e)} 
            onMouseLeave={(e: Evt) => projectRevert(e)}
            aria-expanded={projectState === projectStateEnum['Open'] ? true : false}
            >
            { props.img }
            <div className="content">
                <h3>{ props.title } <span>{ props.subtitle }</span></h3>
                { props.children }
                <a className="btn" href={ props.btn_href } target="_blank">
                    Visit { props.title }
                </a>
            </div>
        </article>
    </>);
}