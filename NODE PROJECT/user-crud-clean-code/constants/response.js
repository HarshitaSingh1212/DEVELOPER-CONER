function processData(data, res) {
    if (Buffer.isBuffer(data)) {
        res.end(data)
    }
    else if (typeof data === 'object') {
        res.setHeader('Content-Type', 'application/json')
        return data
    }
    else {
        return data
    }

    return null;
}

function success({ data, constant }, res) {
    data = processData(data, res)

    if (data === null) {
        return;
    }

    res.end(JSON.stringify({
        data,
        Status: 'SUCCESS',
        message: constant
    }))
}

function redirect({ data, constant }, res) {
    data = processData(data, res)

    if (data === null) {
        return;
    }

    res.end(JSON.stringify({
        data,
        Status: 'REDIRECT',
        message: constant
    }))
}

function error({ status, data, constant }, res) {
    res.status = status
    data = processData(data, res)

    if (data === null) {
        return;
    }
    res.end(JSON.stringify({
        Status: 'ERROR',
        data,
        message: constant
    }))
}

module.exports = {
    redirect, success, error
}
