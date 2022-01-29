S.Util = {
    render: function(id, content) {
        $(id).html(content);
    },

    append: function(id, content) {
        $(id).append(content);
    },

    findName: function(name, content) {
        return $(content).find(`[name="${name}"]`);
    }
}