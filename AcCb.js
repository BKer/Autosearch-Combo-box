/**
 * Autosearch & Combo box
 *
 * Autosearch and Combo box JavaScript classes.
 * This file provides Autosearch and/or Combo box
 * Inspired by Meio.Autocomplete
 *
 * I tried to stick with some sort of MVC model, but I am not sure if I will be
 * able to keep it the MVC way. I am still new to JavaScript, Mootools and
 * even to programming. At the moment I am still going to college, so I am not a professional!
 *
 * "Private" methods start with an underscore -> _ and are marked .protect() where possible
 * All attributes are considered private of course
 *
 * Please update the version number if you made any changes!
 *
 * The code is last tested against:
 *  Midori 0.3.3                2011-04-12
 *  Mozilla Firefox 4.0         2011-04-12
 *  Uzbl 2011.03.17             2011-04-12
 *  Google Chrome 10.0          2011-03-14
 *  Internet Explorer 8         2011-03-14
 *  Mozilla Firefox 3.6.15      2011-03-14
 *  Opera 11.01                 2011-03-14
 *
 * @author Bart Kerkvliet
 * @version 0.4.6
 * @requires MooTools 1.2.* or MooTools 1.3.* (MooTools More is not required)
 * @date 2011-08-13
 * @license LGPL
 */



// For all options see the bottom of this file.



/*
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 *
 * Known issues:
 * Event bubbling isn't possible on custom events. How should the main object
 * know an event got fired and how to give the user the option to write his/her
 * own event handlers? Oh, and neither delegation is usefull on custom events.
 * Passing the event on is ugly? Any other idea's?
 *
 * Filling in a matching name doesn't set the key field. (Not needed, could cause trouble)
 *  No, this still doesn't work, although 9/10 it will if you set setOnlyMatch
 *
 * If a base href is set, problems arise when makeing a request using a relative url
 * (Possible workaround: use a complete path)
 * Probably how base href should work
 *
 * A "customChange" get's fired, this limits external users a bit, because they
 * also have to fire a customChange event and can't rely on the normal change event
 * to occur.
 *
 * The use of static data is not yet possible in a way you would expect.
 *
 * If you enter a very long string the container moves left (Chrome, IE)
 *  This is only the case in MooTools version 1.2.*
 *
 * var self gets used a little too much maybe. Not a big problem, but some
 * prefer the use of .bind(this) over self. At the moment it's mixed a little,
 * only in situations where a self is required it's used, else just the regular
 * this keyword is used. Discussion?
 *
 * When setOnlyMatch and useCache is set a "problem" arises when you find a match
 * and later (value still in cache) enter the same value again.
 * A similar problem arises when you set the useCache to false, but now you will
 * have some trouble removing the text from the input field. I guess it's a timing bug.
 *
 * A long request can cause some lag if an object gets created and destroyed rapidly.
 * Just add a five seconds sleep in, for example the PHP request page.
 * Maybe indicate a request is being made, so people can expect "weird" behaviour?
 *
 * Should we split the file and if so what would be the best split?
 *
 * <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 */



/*##############################################################################
 * Change log:
 *
 * Version: Date:       Description:
 * v0.4.6   2011-08-13  Version bump
 *                      Fixed a small update bug -> OO thinking
 * v0.4.5c  2011-08-13  Documentation update
 *                      Made it GitHub ready
 * v0.4.5b  2011-04-14  Destroy fix (requests)
 *                      Now keeps an array of running requests
 * v0.4.5   2011-04-12  Destroy methods added, to clean up the object
 *                      Added a request type ('get'/'post')
 *                      Fixed detach methods
 *                      Fixed the data part of the request
 *                      Fixed documentation
 * v0.4.4   2011-03-17  Dollar safe: $ -> document.id
 *                      Documentation update
 * v0.4.3a  2011-03-14  Cleaner code
 *                      Removed some redundant code
 *                      Updated known issues
 * v0.4.3   2011-03-14  Added setOnlyMatch
 *                      If only one match is found it is set right away
 * v0.4.2   2011-03-11  Several bug fixes
 *                      Added documentation
 *                      Code clean up
 * v0.4.1   2011-03-10  Minor improvements
 * v0.4     2011-03-09  Workable release
 * v0.3     2011-03-03  Development version (MVC)
 * v0.2     Unknown     Discarded (No left overs, no MVC)
 * v0.1     Unknown     Discarded (No left overs, no MVC)
 * #############################################################################
 */



/**
 * Namespaces
 * Will stick with accb for now
 * accb = Autocomplete combo box
 */
var accb = {};
accb.controller = {};
accb.main = {};
accb.model = {};
accb.view = {};





/*============================================================================*/
/*                                    Main                                    */
/*============================================================================*/
// You can of course write your own "main" methods to reflect your needs
/**
 * Main:
 * Abstract class, so please don't create instances of this class!
 * Base for the Autocomplete and Combo box classes.
 * AcCb is Autocomplete Combo box
 */
accb.main.AbstractAcCb = new Class({
    Implements: [Events, Options],

    // Don't set the options here!
    options: {},
    controller: null, // So the controller can be accessed from the childs

    /**
     * Constructor:
     * Actually this is something like a Main method.
     * @param Object options The options to set, see individual classes!
     */
    initialize: function(options) {
        this.setOptions(options);
        this.controller = new accb.controller.controller();
        var data = new accb.model.Data(this.controller, this.options);

        this.controller.addModel(data);
    },

    /**
     * Destroys the autocomplete or combo box elements
     */
    destroy: function() {
        this.controller.destroy();
    }
});

/**
 * Main:
 * Just something like a main method;
 * This initializes the autcomplete version
 */
accb.main.Autocomplete = new Class({
    Extends: accb.main.AbstractAcCb, // Extend the "base" class

    /**
     * Constructor:
     * Actually this is something like a Main method
     * @param Object options The options to set, see individual classes!
     */
    initialize: function(options) {
        this.parent(options);
        var autocomplete = new accb.view.Autocomplete(this.controller, this.options);
        this.controller.addView(autocomplete);
    }
});

/**
 * Main:
 * Just like the main method
 * This initializes the combo box and it's attributes
 */
accb.main.ComboBox = new Class({
    Extends: accb.main.AbstractAcCb, // Extend the "base" class

    /**
     * Constructor:
     * Actually this is something like a Main method
     * @param Object options The options to set, see individual classes!
     */
    initialize: function(options) {
        this.parent(options);
        var comboBox = new accb.view.ComboBox(this.controller, this.options);
        this.controller.addView(comboBox);
    }
});





/*============================================================================*/
/*                                 Controller                                 */
/*============================================================================*/
/**
 * Controller:
 * The controller, receives events and handles them
 */
accb.controller.controller = new Class({
    Implements: [Events],

    registeredModels: [],
    registeredViews: [],

    /**
     * Constructor:
     * Initialize events
     */
    initialize: function() {
        this._initModelEvents();
        this._initViewEvents();
    },

    /**
     * Add a model component to the controller list
     * @param Model model The model to add to the controller array
     */
    addModel: function(model) {
        this.registeredModels.include(model);
    },

    /**
     * Add a view component to the controller
     * @param View view The model to add to the controller array
     */
    addView: function(view) {
        this.registeredViews.include(view);
    },

    /**
     * Destroy the views and models, but also tell them to clean up theirselfs.
     * Note: Destroy is different from removing the object from the array/list!
     * Remove just detaches the object from the controller, this method really
     * does destroy all attached objects!
     */
    destroy: function() {
        for(var i = 0; i < this.registeredViews.length; i++) {
            try {
                this.registeredViews[i].destroy();
                removeView(this.registeredViews[i]);
            } catch(e) {
                // View does not have a destroy function!
                try {
                    console.log('This view instance does not have a destroy method');
                } catch(ex) {
                    // Could not log to the console
                }
            }
        }
        for(var j = 0; j < this.registeredModels.length; j++) {
            try{
                this.registeredModels[j].destroy();
                removeModel(this.registeredModels[j]);
            } catch(e) {
                // Model does not have a destroy function!
                try {
                    console.log('This model instance does not have a destroy method');
                } catch(ex) {
                    // Could not log to the console
                }
            }
        }
    },

    /**
     * Remove a model from the controller array
     * @param Model model the model to remove from the controller
     */
    removeModel: function(model) {
        this.registeredModels.erase(model);
    },

    /**
     * Remove a view from the controller array
     * @param View view The view to remove from the controller
     */
    removeView: function(view) {
        this.registeredViews.erase(view);
    },

    /**
     * Initialize the model events the controller should listen for
     * @event dataReady Catches dataready to handle the data
     */
    _initModelEvents: function() {
        var self = this;
        this.addEvents({
            dataReady: function(newData) {
                for(var i = 0; i < self.registeredViews.length; i++) {
                    try {
                        self.registeredViews[i].update(newData);
                    } catch(e) {
                        // View does not have this function!
                        try {
                            console.log('This view instance does not have this method');
                        } catch(ex) {
                            // Could not log to the console
                        }
                    }
                }
            }
        });
    }.protect(),

    /**
     * Initialize the view events the controller should listen for
     * @event search Catches the search event and forwards it to the models
     */
    _initViewEvents: function() {
        var self = this;
        this.addEvents({
            search: function(search) {
                for(var i = 0; i < self.registeredModels.length; i++) {
                    try{
                        self.registeredModels[i].update(search);
                    } catch(e) {
                        // Model does not have this function!
                        try {
                            console.log('This model instance does not have this method');
                        } catch(ex) {
                            // Could not log to the console
                        }
                    }
                }
            }
        });
    }.protect()
});





/*============================================================================*/
/*                                    Model                                   */
/*============================================================================*/
/**
 * Model:
 * Caches data, so it can be retrieved for later use
 */
accb.model.Cache = new Class({
    Implements: [Events, Options],

    options: {
        data: {
            cacheSize: 25
        }
    },
    controller: null,
    cache: {},
    pos: [], // Used to keep track of the cache size and its keys

    /**
     * Constructor:
     * Create a cache object
     * @param Object options The options to set
     */
    initialize: function(options) {
        this.setOptions(options);
    },

    /**
     * Add the data to the cache.
     * This is part of the model, so do not cache the html!
     * @param Object key The search parameters
     * @param Object value The data to store
     */
    add: function(key, value) {
        if(!this.getData(key)) { // Check if it is already cached
            var serializedKey = JSON.encode(key); // Used to store and compare objects
            if(this.pos.length >= this.options.data.cacheSize){
                var remove = this.pos.shift(); // Remove the oldest entry from the pos list
                this.cache[remove] = null; // Remove the oldest entry from the cache
                delete this.cache[remove];
            }
            this.cache[serializedKey] = value; // Add the data to the cache
            this.pos.push(serializedKey); // Add the key to the pos array
        }
    },

    /**
     * Flush the cache
     */
    destroy: function() {
        this.cache = {};
        this.pos = [];
        this.controller = null;
    },

    /**
     * If possible return the stored data
     * @return Object The stored data
     */
    getData: function(key) {
        var serializedKey = JSON.encode(key); // Key is a JSON string representation of the object
        return this.cache[serializedKey];
    }
});

/**
 * Model:
 * The data, mainly the search (query) result
 * Calls request to make a request.
 * Has a cache object to cache data
 */
accb.model.Data = new Class({
    Implements: [Events, Options],

    options: {
        data: {
            makeRequest: true,
            requestType: 'get', // Defaults to get, because we get and do not modify
            useCache: true,
            data: []
        },
        search: {
            url: ''
//// Example: 
//            contact: {
//                queryString: '',
//                element: ''
//            },
//            project: {
//                queryString: '',
//                element: ''
//            }
        }
    },
    controller: null,
    cache: null,
    data: [],
    requestArray: [],

    /**
     * Constructor:
     * Create a data object
     * @param Controller controller The controller to fire events
     * @param Object options The options to set
     */
    initialize: function(controller, options) {
        this.setOptions(options);
        this.controller = controller;
        this.cache = new accb.model.Cache(options);
        this.data = this.options.data.data;
    },

    /**
     * Destroy the data
     */
    destroy: function() {
        this.requestArray.each(function(req){
            req.cancel();
        });
        this.requestArray = [];
        this.cache.destroy();
        this.cache = null;
        this.controller = null;
        this.data = [];
    },

    /**
     * Make a request to refresh the data
     * Fires an event to tell the data is ready
     * @param Object search The search parameters
     * @event dataReady Passes the data object
     */
    _makeRequest: function(search) { // FIXME If a base href is set, problems arise
        var self = this;
        var data = this._prepareData(search);
        var request = new Request.JSON({
            url: this.options.search.url,
            data: data,
            method: self.options.data.requestType,
            noCache: !this.options.data.useCache,
            onSuccess: function(responseJSON, responseText) {
                // Pass the data to the controller and add the data to the cache
                self.controller.fireEvent('dataReady', [responseJSON]);
                if(self.options.data.useCache){
                    self.cache.add(search, [responseJSON]);
                }
                self.data = responseJSON;
                self.requestArray.erase(this);
            }
        });
        this.requestArray.push(request);
        request.send();
    }.protect(),

    /**
     * Prepare the data for the request
     * @param Object search the search array
     * @return String the data/url
     */
    _prepareData: function(search) {
        var data = '';
        for(var key in this.options.search) {
            if(this.options.search[key].hasOwnProperty('queryString')
                && this.options.search[key].hasOwnProperty('element')) {
                data += data !== '' ? '&' : '';
                data += this.options.search[key].queryString + '=';
                data += search[key];
            }
        }
        return data;
    }.protect(),

    /**
     * Update the data by checking the cache or making a request
     * @param array search The search factors
     * @event dataReady Could fire a dataReady event and passes data
     */
    update: function(search) {
        var dataFound = false;

        // Check the cache if we want to use the cache
        if(this.options.data.useCache) {
            var data = this.cache.getData(search);
            if(data) {
                this.controller.fireEvent('dataReady', data);
                this.data = data;
                dataFound = true;
            }
        }

        // The data is not found in the cache
        if(!dataFound && this.options.data.makeRequest) {
            this._makeRequest(search);
        }

        // The data is not in the cache and we don't want to make a request
        if(!dataFound && !this.options.data.makeRequest) {
            this.controller.fireEvent('dataReady', this.data);
        }
    }
});





/*============================================================================*/
/*                                    View                                    */
/*============================================================================*/
/**
 * View:
 * The autocomplete class
 */
accb.view.Autocomplete = new Class({
    Implements: [Events, Options],

    options: {
        searchBox: {
            id: '',
            minChars: 1
        },
        keyField: '',
        search: {}
    },
    controller: null, // Fire events to the controller
    keyField: null, // Field to set the identifier
    list: null, // The list to show the data
    searchBox: null, // The searchbox, input field

    ignoreKeys: { // Key presses to ignore
        9:   1,   // tab
        16:  1,   // shift
        17:  1,   // control
        18:  1,   // alt
        224: 1,   // command (meta onkeypress)
        91:  1,   // command (meta onkeydown)
        37:  1,   // left
        38:  1,   // up
        39:  1,   // right
        40:  1    // down
    },

    /**
     * Constructor:
     * Create a autocomplete object
     * @param Controller controller The controller to fire events
     * @param Object options The options to set
     */
    initialize: function(controller, options) {
        this.setOptions(options);
        this.controller = controller;
        this.keyField = document.id(this.options.keyField);
        this.searchBox = document.id(this.options.searchBox.id);
        this.list = new accb.view.List(options, this);
        this.attach(); // Attach events
        var searchArray = this._prepareSearchArray(); // Simulate a search, so the list can be build
        this.controller.fireEvent('search', searchArray);
    },

    /**
     * Add events to the elements that affect the search results
     * @event Add events to monitor changes of elements
     */
    addSearchEvents: function() {
        var self = this;
        var searchArray = {};
        for(var key in this.options.search) {
            if(this.options.search[key].hasOwnProperty('element')) {
                var element = document.id(this.options.search[key].element);
                var events = {
                    'customChange': function() { // Catch a custom change, else clicking becomes unresponsive in some cases
                        if(this.get('id') !== self.searchBox.get('id')){
                            self._reset(); // One parent elements had changed, so reset to reflect the state change
                        }
                        searchArray = self._prepareSearchArray();
                        self.controller.fireEvent('search', searchArray);
                    }
                };
                // Store the events with the element, so they can be removed
                // when needed. Else you maybe should remove all events first.
                // Removing all attached events, because we added one, is something you don't want!
                element.store('searchEvents', events);
                element.addEvents(events);
            }
        }

        // Search events, triggered on keyup
        var typeEvents = {
            'keyup': function(e) {
                switch(e.code) {
                    case 13: // Enter key
                        self.list.setSelected();
                        break;
                    case 27: // Esc key
                        self.list.hide();
                        break;
                    default: // All other key codes
                        if(!self.ignoreKeys[e.code]) {
                            searchArray = self._prepareSearchArray();
                            self.controller.fireEvent('search', searchArray);

                            if(this.get('value').length >= self.options.searchBox.minChars) {
                                self.list.show();
                            } else if(this.get('value').length === 0) {
                                self.list.hide();
                                self._reset(); // Reset does not hide, so hide is called before
                            }
                        }
                        break;
                }
            }
        };
        this.searchBox.store('typeEvents', typeEvents);
        this.searchBox.addEvents(typeEvents);

        // Change the focus
        var changeFocusEvents = {
            'keydown': function(e) {
                switch(e.code){
                    case 9: // Tab-key
                        if(self.searchBox.get('value') !== '' || self.list.isVisible()) {
                            self.list.setSelected();
                        }
                        break;
                    case 13: // Enter
                        e.preventDefault();
                        break;
                    case 38: case 40: // 38 = arrow up - 40 = arrow down (38 just falls through to 40)
                        self.list.moveFocus(e);
                        break;
                    default:
                        break;
                }
            }
        };
        this.searchBox.store('focusEvents', changeFocusEvents);
        this.searchBox.addEvents(changeFocusEvents);
    },

    /**
     * Add events to the document
     * Hide the list on "outer" click
     *
     * This event has to determine what element the user clicked
     * If it's not one of "our" elements hide the container
     */
    addDocumentEvents: function() {
        // Note: document.body and document.window did not seem to work right,
        // but they could be prefered over the use of document
        var self = this;
        var events = {
            'click': function(e){
                if(e.target !== self.searchBox
                    && e.target !== self.toggleSwitch
                    && !self.list.getElement().getChildren().contains(e.target)) {
                    self.list.hide();
                }
            }
        };
        document.id(document).store('listEvents', events);
        document.id(document).addEvents(events);
    },

    /**
     * Add events to the elements
     */
    attach: function(){
        this.addDocumentEvents();
        this.addSearchEvents();
    },

    /**
     * Destroy the autocomplete
     */
    destroy: function() {
        this.detach();
//        this._reset(); //TODO Fix this reset
        this.list.destroy();
        this.controller = null;
    },

    /**
     * Remove assigned events from the elements
     */
    detach: function() {
        //TODO remove the searchEvents?
        this.searchBox.removeEvents(this.searchBox.retrieve('typeEvents'));
        this.searchBox.removeEvents(this.searchBox.retrieve('focusEvents'));
        document.id(document).removeEvents(document.id(document).retrieve('listEvents'));
    },
    
    /**
     * Get the search box element.
     * @return Search box element
     */
    getSearchBox: function() {
        return this.searchBox;
    },

    /**
     * Prepare the array so a search can be made
     * @return Array contains the search factors
     */
    _prepareSearchArray: function() {
        // Should look like {id:value};
        var searchArray = {};

        // Walk through the search options and try to find the options that
        // affect the search result. Those have an element and querystring property.
        // This class doesn't know about the querystring of course, because it's
        // part of the view
        for(var key in this.options.search) {
            if(this.options.search[key].hasOwnProperty('element')) {
                var element = document.id(this.options.search[key].element);
                searchArray[key] = element.get('value');
            }
        }
        return searchArray;
    },

    /**
     * Reset the fields
     * This will clear all the fields, so it doesn't serve old data.
     * @event Fires the customChange event
     */
    _reset: function() {
        this.searchBox.set('value', '');
        this.searchBox.fireEvent('customChange');
        this.keyField.set('value', '');
        this.keyField.fireEvent('customChange');
    },
    
    /**
     * Set the item
     * In other words fill the key field and update the search box
     * @param Object item The element to set
     */
    setItem: function(item) {
        if(item !== undefined) { // Could happen if there is no data and enter is hit
            this.searchBox.set('value', item.retrieve('rawData'));
            this.searchBox.fireEvent('customChange'); // Fire a custom change, else clicking becomes unresponsive sometimes;
            this.keyField.set('value', item.retrieve('identifier'));
            this.keyField.fireEvent('customChange'); // Fire a custom change, else clicking becomes unresponsive sometimes;
        }
    },

    /**
     * Update the Autocomplete
     * Passes the data and the search box coordinates to the list, so it can
     * update as well.
     * @param Object data The data to show
     */
    update: function(data) {
        this.list.update(data);
    }
});

/**
 * View:
 * The combo box class
 */
accb.view.ComboBox = new Class({
    Extends: accb.view.Autocomplete,

    options: {
        toggleSwitch: ''
    },
    toggleSwitch: null,

    /**
     * Constructor:
     * Create a combo box object
     * @param Controller controller The controller to fire events
     * @param Object options The options to set
     */
    initialize: function(controller, options) {
        this.parent(controller, options);
        this.toggleSwitch = document.id(this.options.toggleSwitch);
        this.addToggleSwitchEvents();
    },

    /**
     * Add an event to the toggle switch to open and close the list
     * @event click Adds a click event to the toggle switch to toggle the list
     *          hide it if it's vissible and show it if it's invisible
     */
    addToggleSwitchEvents: function() {
        var self = this;
        var events = {
            'click': function(){
                self.list.toggle();
                self.searchBox.focus();
            }
        };
        this.toggleSwitch.store('listEvents', events);
        this.toggleSwitch.addEvents(events);
    },

    /**
     * Destroy the combobox
     * Makes a call to the destroy function of the parent
     */
    destroy: function() {
        this.removeToggleSwitchEvents();
        this.parent();
    },

    /**
     * Remove the "toggle" event from the toggle switch
     */
    removeToggleSwitchEvents: function() {
        this.toggleSwitch.removeEvents(this.toggleSwitch.retrieve('listEvents'));
    }
});

/**
 * View:
 * List object, div container -> ul -> li
 */
accb.view.List = new Class({
    Implements: [Events, Options],

    options: {
        style: {
            container:  'AcCb_Container',
            hover:      'AcCb_li_hover',
            odd:        'AcCb_li_odd',
            even:       'AcCb_li_even'
        },
        setOnlyMatch: false
    },
    autocomplete: null,
    element: null,
    focusedItem: null,
    visible: false,

    /**
     * Constructor:
     * Create a list item
     * @param Object options The options to set
     */
    initialize: function(options, autocomplete) {
        this.setOptions(options);
        this.autocomplete = autocomplete;
        this.initList();
    },

    /**
     * Initialize the list element
     */
    initList: function() {
        this.element = new Element('div', {
            'class': this.options.style.container
        });

        var ul = new Element('ul');

        this.element.grab(ul); // Add the list to the container

        this.hide(); // Make sure it's hidden on start
        document.id(document.body).grab(this.element); // Add the list to the page
        this._setStyle();
    },

    /**
     * Set the list items and build the list
     * @param Object data The data to show
     */
    _buildList: function(data) {
        this.focusedItem = null;
        var self = this, ul = new Element('ul'), index = 0;

        for(var key in data) {
            // If the object has the identifier and data property it's considered
            // valid data. Else it could be a native JavaScript/MooTools object.
            if(data[key].hasOwnProperty('identifier')
                && data[key].hasOwnProperty('data')) {
                var events = {
                    mouseover: function() { // Mark the right item, being hovered
                        if(self.focusedItem) {
                            self.focusedItem.removeClass(self.options.style.hover);
                        }
                        this.addClass(self.options.style.hover);
                        self.focusedItem = this;
                    },
                    click: function() { // Set the values of this item
                        self.autocomplete.setItem(this);
                    }
                }
                var showData = this._prepareShowData(data[key].data);

                var li = new Element('li', { // List item
                    'class': index % 2 ? this.options.style.even : this.options.style.odd,
                    html: showData,
                    title: data[key].data,
                    events: events
                });
                li.store('listEvents', events); // Store the events, so they can be removed later (if needed)
                li.store('rawData', data[key].data); // Store the rawData, so it can be retrieved for later use, i.e. onClick
                li.store('identifier', data[key].identifier); // Store the identifier, so it can be retrieved for later use
                ul.grab(li);
            }
            index++;
        }
        ul.replaces(this.element.getChildren('ul')[0]);
    }.protect(),

    /**
     * Destroy the list element.
     * In other words remove the element from the body
     */
    destroy: function() {
        this.element.destroy();
        this.focusedItem = null;
        this.visible = false;
    },

    /**
     * Returns the element (the container div)
     * @return Object The container div
     */
    getElement: function() {
        return this.element;
    },

    /**
     * Hide the list, by making giving it the visibility value of hidden.
     */
    hide: function() {
        this.element.setStyle('visibility', 'hidden');
        this.visible = false;
    },

    /**
     * Is the list visible or not?
     * @return boolean visbile or not
     */
    isVisible: function() {
        return this.visible;
    },

    /**
     * Move the focus to the item in the given direction
     * @param Object key The key object
     */
    moveFocus: function(keyEvent) {
        var element = null;
        switch(keyEvent.code) {
            case 38: // Up arrow
                if(this.focusedItem !== null && this.focusedItem !== undefined) {
                    element = this.focusedItem.getPrevious();
                }
                break;
            case 40: // Down arrow
                if(this.focusedItem !== null
                    && this.focusedItem !== undefined
                    && this.isVisible()) {
                    element = this.focusedItem.getNext();
                } else {
                    if(this.focusedItem) {
                        this.focusedItem.removeClass(this.options.style.hover);
                    }

                    this.focusedItem = this.getElement().getElements('li')[0];
                    if(this.focusedItem) {
                        this.focusedItem.addClass(this.options.style.hover);
                    }

                    if(!this.isVisible()) {
                        this.show();
                    }
                }
                break;
            default:
                // Other keys -> do nothing;
                break;
        }
        if(element !== null) {
            this._setScroll(element);

            element.addClass(this.options.style.hover);
            this.focusedItem.removeClass(this.options.style.hover);
            this.focusedItem = element;
        }
    },

    /**
     * Prepare data to show
     * @param String data The data string
     * @return String the prepared data
     */
    _prepareShowData: function(data) {
        var searchBox = document.id(this.options.searchBox.id);
        var search = searchBox.get('value'); // Get the search string to match

        // This keeps captitals showing up being a capital and vice versa
        if(search !== '') { // If there is a search, we should prepare/style the data
            var re = new RegExp(search.escapeRegExp(), 'gi'); // Make a global case insensitive search;
            var matches = data.match(re);
            if(matches !== null) { // If a match is found prepare/style the data
                matches.each(function(match){
                    // Now find the match, but not if it's part of "strong>"
                    // and replace the match
                    // Note: This should be case sensitive!
                    var re = new RegExp('('+match.escapeRegExp()+')(?![A-Za-z]{0,5}>)', 'g');
                    data = data.replace(re, '<strong>'+match+'</strong>');
                });
            }
        }
        return data;
    }.protect(),

    /**
     * Set the scroll height of the dropdown list.
     * If the item is below the view port move it down
     * If the item is above the view port move it up
     * @param Object element The element to scroll to
     */
    _setScroll: function(element) {
        //TODO Efficiency??
        var listHeight = this.getElement().getCoordinates().height;
        var scrollBegin = this.getElement().getScroll().y;
        var scrollEnd = scrollBegin + listHeight;

        var itemCoordinates = element.getCoordinates(this.getElement());
        var itemTop = itemCoordinates.top;
        var itemBottom = itemTop + itemCoordinates.height;
        if(itemTop < scrollBegin) {
            var borderTop = this.getElement().getStyle('border-top-width').toInt();
            this.getElement().scrollTo(0, itemTop - borderTop);
        } else if(itemBottom > scrollEnd) {
            var borderBottom = this.getElement().getStyle('border-bottom-width').toInt();
            this.getElement().scrollTo(0, itemBottom - (listHeight - borderBottom));
        }
    }.protect(),

    /**
     * Set the hovered item
     */
    setSelected: function() {
        if(this.focusedItem) {
            this.autocomplete.setItem(this.focusedItem);
        } else { // Get the first list item
            this.autocomplete.setItem(this.element.getElements('li')[0]);
        }
        this.hide();
    },

    /**
     * Set the list style
     * This style can change over time, because for example the position of the
     * search box changes.
     * @param Object coordinates The coordinates to use
     */
    _setStyle: function() {
        var coordinates = this.autocomplete.getSearchBox().getCoordinates();
        var borderWidth = this.element.getStyle('border-right-width').toInt()
                            + this.element.getStyle('border-left-width').toInt();
        this.element.setStyles({
            'top': coordinates.top + coordinates.height,
            'left': coordinates.left,
            'width': this.element.getStyle('width').toInt() ?
                        this.element.getStyle('width') : (coordinates.width - borderWidth)
            //XXX NOTE: This could cause trouble in the case of a width set to inherit or auto
        });
    }.protect(),

    /**
     * Show the list, by setting the visibility property to visible
     */
    show: function() {
        this.element.setStyle('visibility', 'visible');
        this.visible = true;
    },

    /**
     * Toggle the list
     * If it's visible hide it
     * If it's hidden show it
     */
    toggle: function() {
        this.isVisible() ? this.hide() : this.show();
    },

    /**
     * Update the list elements
     * Set the data and text
     * @param Object data The data to set
     * @param Object coordinates The coordinates to position the list
     */
    update: function(data) {
        this._setStyle();
        this._buildList(data);

        //FIXME Pretty ugly hack I think and does not work right the second time (cause => Cache :S)
        // -> typeEvents -> show()
        if(this.options.setOnlyMatch && data.length === 1) {
            var el = this.element.getElement('li');
            var searchBox = document.id(this.options.searchBox.id);
            if(el.retrieve('rawData') != searchBox.get('value')){ // To stop setting the item
                this.autocomplete.setItem(el);
                this.hide();
            }
        }
    }
});





// All possible options + their defaults;
//
//options{
//    searchBox: {
//        id: '',
//        minChars: 1
//    },
//    keyField: '',
//    toggleSwitch: '',
//    style: {
//            container:    'AcCb_Container',
//            hover:        'AcCb_li_hover',
//            odd:          'AcCb_li_odd',
//            even:         'AcCb_li_even'
//    },
//    search: {
//        url: ''
//        contact: {
//            queryString: '',
//            element: ''
//        },
//        project: {
//            queryString: '',
//            element: ''
//        }
//    },
//    data: {
//        makeRequest: true,
//        requestType: 'get',
//        useCache: true,
//        cacheSize: 25,
//        data: []
//    },
//    setOnlyMatch: false
//}
