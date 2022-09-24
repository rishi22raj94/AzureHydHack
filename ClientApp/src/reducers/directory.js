import nasdaq from "../assets/Nasdaq.PNG";
import nifty from "../assets/Nifty.png";
import niftyLargeCap from "../assets/Nifty-Large-Cap.png";
import niftyMidCap from "../assets/Nifty-Mid-Cap.png";
import niftySmallCap from "../assets/Nifty-Small-Cap.png";

const INITIAL_STATE = {
    sections: [
        {
            title: 'IN-Large Cap',
            imageUrl: niftyLargeCap,
            id: 1,
            linkUrl: '/largecap'
        },
        {
            title: 'IN-Mid Cap',
            imageUrl: niftyMidCap,
            id: 2,
            linkUrl: '/midcap'
        },
        {
            title: 'IN-Small Cap',
            imageUrl: niftySmallCap,
            id: 3,
            linkUrl: '/smallcap'
        },
        {
            title: 'IN-Nifty 50',
            imageUrl: nifty,
            size: 'large',
            id: 4,
            linkUrl: '/nifty50'
        },
        {
            title: 'US-NASDAQ 100',
            imageUrl: nasdaq,
            size: 'large',
            id: 5,
            linkUrl: '/nasdaq100'
        }
    ]
};

export const directory = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        default:
            return state;
    }
};