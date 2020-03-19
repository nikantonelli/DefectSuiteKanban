(function () {
    var Ext = window.Ext4 || window.Ext;

    Ext.define('Rally.apps.kanban.Column', {
        extend: 'Rally.ui.cardboard.Column',
        alias: 'widget.kanbancolumn',

        config: {
            hideReleasedCards: false,
            hideOldCards: false,
            sortField: 'DragAndDropRank'
        },

        _getAge: function() {
            return this.ownerCardboard.up('#Kanban').getSetting('cardAgeThreshold');
        },

        getStoreFilter: function (model) {
            var filters = [];
            Ext.Array.push(filters, this.callParent(arguments));
            if (model.elementName === 'HierarchicalRequirement') {
                if (this.context.getSubscription().StoryHierarchyEnabled) {
                    filters.push({
                        property: 'DirectChildrenCount',
                        value: 0
                    });
                }
            }

            if (this.hideReleasedCards) {
                filters.push({
                    property: 'Release',
                    value: null
                });
            }
            if (this.hideOldCards) {
                filters.push({
                    property: 'LastUpdateDate',
                    operator: '>',
                    value: Ext.Date.format(Ext.Date.subtract(new Date(), Ext.Date.DAY,this._getAge()), "Y-m-d\\TH:i:s")
                });
            }

            return filters;
        }
    });
})();
