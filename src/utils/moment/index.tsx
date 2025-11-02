import moment from "moment"

export function configureMomentLocale() {
    moment.updateLocale('en', {
        relativeTime: {
            future: 'in %s',
            past: '%s',
            s: '%ds',
            ss: '%ds',
            m: '1m',
            mm: '%dm',
            h: '1h',
            hh: '%dh',
            d: '1d',
            dd: '%dd',
            M: '1mo',
            MM: '%dmo',
            y: '1y',
            yy: '%dy'
        }
    })
}

export function momentHumanize() {
    moment.updateLocale('en', {
        relativeTime: {
            future: 'in %s ago',
            past: '%s ago',
            s: '%ds',
            ss: '%ds',
            m: '1m',
            mm: '%dm',
            h: '1h',
            hh: '%dh',
            d: '1d',
            dd: '%dd',
            M: '1mo',
            MM: '%dmo',
            y: '1y',
            yy: '%dy'
        }
    })
}




