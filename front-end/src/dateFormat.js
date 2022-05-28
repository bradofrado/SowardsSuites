import dayjs from 'dayjs'

function dateFormat(date) {
    return date ? dayjs(date).format('MM/DD/YYYY') : ''
}

export function rangeFormat(range) {
    return range ? `${dateFormat(range.start)}-${dateFormat(range.end)}` : '';
}

export function Copy(obj)
{
    return JSON.parse(JSON.stringify(obj));
}

export default dateFormat;