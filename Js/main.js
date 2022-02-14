(function () {
    S = {
        debug: false,
        app: "#app"
    }

    let setDependencies = function() {
        S.Pages = {};
        S.Control = {};
    };

    let onLoad = function () {
        //S.Fix.href("body");                
    }

    setDependencies();

    window.addEventListener('load', onLoad);
    
    S.Fix = (function(){
        var _fix = function (target) {
            const _target = target ? target : S.app;

            var didMutation = false;
            // Create an observer instance linked to the callback function
            const observer = new MutationObserver(function (mutationsList, observer) {
                if (!didMutation)
                {
                    S.Fix.href(_target);                    
                }                

                didMutation = !didMutation;
            });
            const config = {attributes: true, childList: true, subtree: true};
            
            // Start observing the target node for configured mutations
            observer.observe($(_target)[0], config);  

            this.fixHref = function(target) {
                target = target ? target : S.app;
                const atags = $(target).find('a');
            
                for (let i = 0; i < atags.length; i++)
                {
                    const oldHref = $(atags[i]).attr('href');
                    if (oldHref[0] === '/') {
                        $(atags[i]).attr('href', `#${oldHref}`);
                    }
                }
            }
        }
        
        return _fix;
    })();

    //let fix = new S.Fix();

    S.Fix.href = function (target) {
        fix.fixHref(target);
    }
    
      
})();

