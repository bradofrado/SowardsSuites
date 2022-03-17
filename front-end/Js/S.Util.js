S.Util = {
    render: function(id, content) {
        $(id).html(content);
    },

    append: function(id, content) {
        $(id).append(content);
    },

    findName: function(name, content) {
        const template = content instanceof jQuery ? content : $(content);
        return template.find(`[name="${name}"]`);
    }
}