import dayjs from 'dayjs'

function dateFormat(date) {
    return date ? dayjs(date).format('MM/DD/YYYY') : ''
}

export default dateFormat;