$(document)
    .ready(function() {
      // fix menu when passed
      $('.masthead')
        .visibility({
          once: false,
          onBottomPassed: function() {
            $('.fixed.menu').transition('fade in');
          },
          onBottomPassedReverse: function() {
            $('.fixed.menu').transition('fade out');
          }
        })
      ;
      // create sidebar and attach to menu open
      $('.ui.sidebar')
        .sidebar('attach events', '.toc.item')
      ;
    })
  ;
// todo handle focus
var bsNav = {

	init: function(){
		this.cacheDOM();
		this.stateLanding();
		this.dropdownToggle();
		this.handleToggles();
	},
	
	cacheDOM: function(){
		this.$navParent = $(".navbar");
		this.$navBarCollapseTarget = $(".navbar-collapse");
		this.$dropdownMenuParents = this.$navParent.find(".dropdown");
		this.$dropdownMenus = this.$dropdownMenuParents.find(".dropdown-menu");
		this.$menuItems = this.$navParent.find("li");
		this.$navBarToggleAnchor = this.$navParent.find("a.navbar-toggle");
		this.$navBarToggleButton = this.$navParent.find("button.navbar-toggle");
	},
	
	stateLanding: function(){
		
		// dropdown parents
		this.$dropdownMenuParents.attr({
			"aria-haspopup": "true"
		});
		
		// dropdown menus
		this.$dropdownMenus.attr({
			"aria-hidden": "true",
			"role": "menu"
		});
		
		// dropdown menu items
		this.$menuItems.attr({
			"role": "menuitem"
		});
		
	},
	
	dropdownToggle: function(){
		
		// Bootstrap event - dropdown is shown - toggle aria
		this.$dropdownMenuParents.on("shown.bs.dropdown", function(){
			$(this).find(".dropdown-menu").attr("aria-hidden","false");
		});
		
		// Bootstrap event - dropdown is hidden - toggle aria
		this.$dropdownMenuParents.on("hidden.bs.dropdown", function(){
			$(this).find(".dropdown-menu").attr("aria-hidden","true");
		});
		
	},
	
	handleToggles: function(){
		
		// hide anchor toggle from AT
		this.$navBarToggleAnchor.attr({
			"aria-hidden" : "true",
			"tabindex": "-1"
		});
		
		// show button toggle to AT
		this.$navBarToggleButton.attr({
			"aria-hidden" : "false"
		});
		
	}

};

  $(document)
    .ready(function() {
      $('.ui.form')
        .form({
          fields: {
            email: {
              identifier  : 'email',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your e-mail'
                },
                {
                  type   : 'email',
                  prompt : 'Please enter a valid e-mail'
                }
              ]
            },
            password: {
              identifier  : 'password',
              rules: [
                {
                  type   : 'empty',
                  prompt : 'Please enter your password'
                },
                {
                  type   : 'length[6]',
                  prompt : 'Your password must be at least 6 characters'
                }
              ]
            }
          }
        })
      ;
    })
  ;