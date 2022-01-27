(function () {
    S = {
        debug: false,
        app: "#app"
    }

    let onLoad = function () {
        S.Fix.href("body");        
    }

    window.addEventListener('load', onLoad);
    
    S.Fix = (function(){
        var _fix = function (target) {
            const _target = target ? target : "app";

            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(function (mutationsList, observer) {
                fixHref(_target);
            });
            const config = {attributes: true, childList: true, subtree: true};
            
            // Start observing the target node for configured mutations
            observer.observe(document.getElementById(_target), config);  
        }

        _fix.fixHref = function(target) {
            const atags = $(target).find('a');
        
            for (let i = 0; i < atags.length; i++)
            {
                const oldHref = $(atags[i]).attr('href');
                $(atags[i]).attr('href', `#${oldHref}`);
            }
        }
        
        return _fix;
    });

    let fix = new S.Fix();

    S.Fix.href = function (target) {
        fix.fixHref(target);
    }
    
      
})();

