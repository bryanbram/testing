(function($) {
    if (typeof SourceCode === "undefined" || SourceCode === null)
        SourceCode = {};
    if (typeof SourceCode.Forms === "undefined" || SourceCode.Forms === null)
        SourceCode.Forms = {};
    if (typeof SourceCode.Forms.Controls === "undefined" || SourceCode.Forms.Controls === null)
        SourceCode.Forms.Controls = {};
    if (typeof SourceCode.Forms.Controls.Web === "undefined" || SourceCode.Forms.Controls.Web === null)
        SourceCode.Forms.Controls.Web = {};
    var designTableArrays;
    var designTD;
    var _rowCount = null;
    var _columnCount = null;
    SourceCode.Forms.Controls.Web.TableBehavior = function(element) {
        SourceCode.Forms.Controls.Web.TableBehavior.initializeBase(this, [element]);
        this._isEnabled = true;
        this._isParentEnabled = true;
        this._isVisible = true;
        this._isParentVisible = true;
        this._isReadOnly = false;
        this._isParentReadOnly = false;
        this.style = SourceCode.Forms.Controls.Base.emptyStylesNode;
        this._width = '100%';
        this._initialized = false;
    }
    window.SFCTable = jQuery.extend(SourceCode.Forms.Controls.Web.TableBehavior.prototype, {
        designTableArrays: [],
        initialize: function() {
            SourceCode.Forms.Controls.Web.TableBehavior.callBaseMethod(this, 'initialize');
            this._initialized = true;
        },
        _setControlProperty: function(property, value) {
            var thisId = this.get_element().id;
            var currentId = "";
            var prevId = "";
            var i = 0;
            if (!checkExists(this._childControlIDs)) {
                this._childControlIDs = [];
                var controlsFullList = $(this.get_element()).find('*[id]');
                i = controlsFullList.length;
                while (i--) {
                    var currentControl = controlsFullList[i];
                    var jqCurrentControl = $(currentControl);
                    var currentControlID = "";
                    if (currentControl.id.length >= 73) {
                        currentControlID = currentControl.id.substring(0, 73);
                        if (this._childControlIDs.indexOf(currentControlID) < 0 && currentControl.id.indexOf("rtSearchConfig") === -1 && currentControl.id.indexOf("ClientState") === -1) {
                            var closestTable = jqCurrentControl.parent().closest("table");
                            while (closestTable.length > 0 && closestTable[0].id !== thisId && closestTable[0].id.indexOf("_Table") !== 73) {
                                closestTable = closestTable.parent().closest("table");
                            }
                            if (closestTable.length > 0 && closestTable[0].id === thisId) {
                                this._childControlIDs.push(currentControlID);
                                SetControlProperty(currentControlID, property, value, null, null, false);
                            }
                        }
                    }
                }
            } else {
                i = this._childControlIDs.length;
                var currentControlID = "";
                while (i--) {
                    currentControlID = this._childControlIDs[i];
                    SetControlProperty(currentControlID, property, value, null, null, false);
                }
            }
        },
        _getBooleanValue: function(value) {
            return ['1', 'true', 'yes'].contains(value.toString().toLowerCase());
        },
        get_isEnabled: function() {
            return this._isEnabled;
        },
        setIsEnabled: function(value) {
            value = this._getBooleanValue(value);
            this._isEnabled = value;
            this._setControlProperty('isparentenabled', value);
        },
        get_isParentEnabled: function() {
            return this._isParentEnabled;
        },
        setIsParentEnabled: function(value) {
            value = this._getBooleanValue(value);
            this._isParentEnabled = value;
            if (this._isEnabled === false) {
                return;
            }
            this._setControlProperty('isparentenabled', value);
        },
        get_isReadOnly: function() {
            return this._isReadOnly;
        },
        setIsReadOnly: function(value) {
            value = this._getBooleanValue(value);
            this._isReadOnly = value;
            var isParentReadOnly = this.get_isParentReadOnly();
            value = isParentReadOnly === true || value === true;
            this._setControlProperty('isparentreadonly', value);
        },
        get_isParentReadOnly: function() {
            return this._isParentReadOnly;
        },
        setIsParentReadOnly: function(value) {
            value = this._getBooleanValue(value);
            this._isParentReadOnly = value;
            if (this._isReadOnly === true) {
                return;
            }
            this._setControlProperty('isparentreadonly', value);
        },
        get_isParentVisible: function() {
            return this._isParentVisible;
        },
        setIsParentVisible: function(value) {
            value = this._getBooleanValue(value);
            this._isParentVisible = value;
            this.applyVisibility();
        },
        setIsVisible: function(value) {
            value = this._getBooleanValue(value);
            this._isVisible = value;
            this.applyVisibility();
        },
        get_isVisible: function() {
            return this._isVisible;
        },
        applyVisibility: function() {
            if (this._initialized) {
                var combinedValue = (this._isParentVisible && this._isVisible);
                var element = document.getElementById(this._id + "_Table");
                if (checkExists(element) && checkExists(element.style)) {
                    element.style.display = combinedValue ? 'inline-table' : 'none';
                }
                this._setControlProperty('isparentvisible', combinedValue);
            }
        },
        get_width: function() {
            return this._width;
        },
        style: function(style) {
            if (typeof style === "undefined") {
                return this.style;
            } else {
                if (this.style === style) {
                    return;
                } else {
                    this.style = style;
                    this.setStyles(null, style);
                }
            }
        },
        setStyles: function(wrapper, styles) {
            var cells = wrapper.find('table>tbody>tr>td.editor-cell');
            var options = {
                "border": cells,
                "padding": cells,
            };
            for (var i = 0; i < cells.length; i++) {
                cells[i].style.border = '';
                cells[i].style.padding = '';
            }
            var styleXml = StyleHelper.getDefaultStyleNode(styles);
            if (checkExists(options.border)) {
                StyleHelper.setBorderStyles(options.border, styleXml);
            }
            if (checkExists(options.padding)) {
                StyleHelper.setPaddingStyles(options.padding, styleXml);
            }
        },
        _tablePopup: function(contextobject, data, designer, controlid, customHeaderText) {
            var $contentPanel = jQuery("<div id='InsertTableLayoutContent'/>").html(SCFormField.html({
                forid: 'pgTableColumnCount',
                label: Resources.FormDesigner.TableColumnCountLabel,
                required: true
            }) + SCFormField.html({
                forid: 'pgTableRowCount',
                label: Resources.FormDesigner.TableRowCountLabel,
                required: true
            }));
            var argumentCount = arguments.length;
            popupManager.showPopup({
                buttons: [{
                    type: "help",
                    click: function() {
                        HelpHelper.runHelp(7035);
                    }
                }, {
                    click: function() {
                        if (!SourceCode.Forms.Controls.Web.TableBehavior.prototype.valuesValid()) {
                            popupManager.showError(Resources.FormDesigner.TableControlValueValidationMessage);
                            return;
                        } else {
                            _columnCount = $("#pgTableColumnCount").val();
                            _rowCount = $("#pgTableRowCount").val();
                            var closePopup = true;
                            if ((!checkExists(data)) && (!checkExists(designer)) && (!checkExists(controlid))) {
                                closePopup = contextobject(_columnCount, _rowCount);
                                if (!checkExists(closePopup)) {
                                    closePopup = true;
                                }
                            } else {
                                if (designer !== SourceCode.Forms.Designers.Form) {
                                    if (contextobject !== null) {
                                        switch (designer.DesignerTable.ViewDesigner._getViewType()) {
                                        case 'CaptureList':
                                            if (data.itemtype === 'layoutcontainer') {
                                                if (data.section === 'toolbarSection') {
                                                    designer.DragDrop._CaptureViewDropControl(contextobject, data, true);
                                                }
                                            }
                                            break;
                                        default:
                                            designer.DesignerTable._CaptureViewDrop(contextobject, data, null, true);
                                            break;
                                        }
                                    }
                                } else {
                                    data.controlType = "Table";
                                    data.columnCount = _columnCount;
                                    data.rowCount = _rowCount;
                                    SourceCode.Forms.Designers.Common.Context.insertControl(data);
                                }
                            }
                        }
                        if (closePopup) {
                            popupManager.closeLast();
                        }
                    },
                    text: Resources.Wizard.OKText
                }, {
                    click: function() {
                        if (designer === SourceCode.Forms.Designers.Form) {
                            if ($(this).is('.disabled') || !designer._checkOut()) {
                                return;
                            }
                        }
                    },
                    id: 'pgTableLayoutDialog_Cancel',
                    text: Resources.Wizard.CancelText
                }],
                closeWith: 'pgTableLayoutDialog_Cancel',
                content: $contentPanel,
                headerText: checkExistsNotEmpty(customHeaderText) ? customHeaderText : Resources.Designers.InsertTableText,
                height: $.browser.mozilla ? 167 : 165,
                id: "InsertTableLayoutDialog",
                removeContent: true,
                width: 350
            });
            var $wrappers = $contentPanel.find('.form-field-element-wrapper');
            rows = SourceCode.Forms.Designers.View.selectedOptions.RowCount === 0 ? 3 : SourceCode.Forms.Designers.View.selectedOptions.RowCount;
            columns = SourceCode.Forms.Designers.View.selectedOptions.ColumnCount === 0 ? 3 : SourceCode.Forms.Designers.View.selectedOptions.ColumnCount;
            if (typeof contextobject !== 'function') {
                rows = 3;
                columns = 3;
            }
            $wrappers.eq(0).html(SCTextbox.html({
                id: 'pgTableColumnCount',
                value: columns
            }));
            $wrappers.eq(1).html(SCTextbox.html({
                id: 'pgTableRowCount',
                value: rows
            }));
            $wrappers.find('input').textbox();
            $contentPanel.panel({
                fullsize: true
            });
            $("#pgTableColumnCount")[0].focus();
        },
        valuesValid: function() {
            var isvalid = false;
            var reg = /^(20|1\d|[1-9]){1}$/;
            if (reg.test($("#pgTableColumnCount").val()) && reg.test($("#pgTableRowCount").val()))
                return true;
            else
                return false;
        },
        _getParentTD: function(obj) {
            obj = jQuery(obj);
            if (obj.is('td'))
                return obj;
            var parentObj = obj.parent();
            if (parentObj.length > 0) {
                while (!parentObj.is('td')) {
                    parentObj = parentObj.parent();
                    if (parentObj.length === 0) {
                        return null;
                    }
                }
            } else {
                return null;
            }
            return parentObj;
        },
        _getParentTable: function(obj) {
            obj = jQuery(obj);
            if (obj.is('table')) {
                return obj;
            }
            var parentObj = obj.parent();
            if (parentObj.length > 0) {
                while (!parentObj.is('table')) {
                    parentObj = parentObj.parent();
                    if (parentObj.length === 0) {
                        return null;
                    }
                }
            } else {
                return null;
            }
            return parentObj;
        },
        _TableColumnCount: function(table) {
            var maxCols = 0;
            if (checkExists(table)) {
                var rows = table.find('>tbody>tr');
                for (var r = 0; r < rows.length; r++) {
                    var oCRow = jQuery(rows[r]);
                    if (oCRow.length > 0) {
                        var cells = oCRow.find('>td');
                        for (var c = 0; c < cells.length; c++) {
                            maxCols = cells.length > parseInt(maxCols) ? cells.length : parseInt(maxCols);
                        }
                    }
                }
            }
            return maxCols;
        },
        generateTableLayout: function(table, _controlNode, designer) {
            var tableID = _controlNode.getAttribute("ID");
            var _table = $("<table id='" + tableID + "' style='table-layout: fixed;'></table>");
            var tableArray = table.toArray();
            for (var i = 0; i < tableArray[0].attributes.length; i++) {
                if (tableArray[0].attributes[i].name !== "id") {
                    _table.attr(tableArray[0].attributes[i].name, tableArray[0].attributes[i].value);
                }
            }
            $("<colgroup class='editor-body-colgroup' /></colgroup><tbody></tbody>").appendTo(_table);
            var _trTag = $("<tr />");
            for (var i = 0; i < tableArray[0].rows[0].attributes.length; i++) {
                if (tableArray[0].rows[0].attributes[i].name !== "id") {
                    _trTag.attr(tableArray[0].rows[0].attributes[i].name, tableArray[0].rows[0].attributes[i].value);
                }
            }
            var _tdTag = $("<td itemtype='Cell' controltype='Cell' friendlyname='' layout='Cell' />");
            for (var i = 0; i < tableArray[0].rows[0].cells[0].attributes.length; i++) {
                if (tableArray[0].rows[0].cells[0].attributes[i].name !== "id" && tableArray[0].rows[0].cells[0].attributes[i].name !== "width") {
                    _tdTag.attr(tableArray[0].rows[0].cells[0].attributes[i].name, tableArray[0].rows[0].cells[0].attributes[i].value);
                }
            }
            $.each(_controlNode.selectNodes('Columns/Column'), function() {
                var colid = $(this).attr("ID");
                var _w = $(this).attr("Size");
                var _col = $("<col id='" + colid + "' style='width:" + _w + ";'/>").appendTo(_table.children("colgroup"));
            });
            $.each(_controlNode.selectNodes('Rows/Row'), function() {
                var rid = $(this).attr("ID");
                var _tr = $("<tr id='" + rid + "' class='editor-row'/>").appendTo(_table.children("tbody"));
                $.each(this.selectNodes('Cells/Cell'), function() {
                    var cid = $(this).attr("ID");
                    var _td = $("<td id='" + cid + "' class='editor-cell can-hover'/>");
                    var _columnSpan = +this.getAttribute('ColumnSpan');
                    var _rowSpan = +this.getAttribute('RowSpan');
                    !!_columnSpan && (_td.attr("colspan", _columnSpan));
                    !!_rowSpan && (_td.attr("rowspan", _rowSpan));
                    _td.appendTo(_tr);
                    var ccn = designer.formNode.selectSingleNode("//Controls/Control[@ID='" + cid + "']");
                    var _styleNode = (!!ccn) ? ccn.selectSingleNode("Styles/Style[@IsDefault='True']") : null;
                    if (!!_styleNode) {
                        var _textAlignNode = _styleNode.selectSingleNode('Text/Align');
                        if (!!_textAlignNode) {
                            var _textAlign = _textAlignNode.text;
                            !!_textAlign && _td.css('text-align', _textAlign);
                        }
                        var _verticalAlignNode = _styleNode.selectSingleNode('VerticalAlign');
                        if (!!_verticalAlignNode) {
                            var _verticalAlign = _verticalAlignNode.text;
                            !!_verticalAlign && _td.css('vertical-align', _verticalAlign);
                        }
                    }
                });
            });
            var jq_cells = _table.find(">tbody>tr:first>td");
            for (c = 0; c < jq_cells.length; c++) {
                if (jq_cells[c].colSpan > 1) {
                    SourceCode.Forms.Controls.Web.TableBehavior.prototype._removeEmptyColumns(_table, c, 0);
                }
            }
            this.designTableArrays[_table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(_table);
            _table.outerHTML(_table.outerHTML().replaceSpacesBetweenTags());
            return _table;
        },
        createNewTable: function(table, controlXML, designer, id) {
            var _table = $("<table id='" + id + "' style='table-layout: fixed;'></table>");
            var tableArray = table.toArray();
            for (var i = 0; i < tableArray[0].attributes.length; i++) {
                if (tableArray[0].attributes[i].name !== "id") {
                    _table.attr(tableArray[0].attributes[i].name, tableArray[0].attributes[i].value);
                }
            }
            $("<colgroup class='editor-body-colgroup' /></colgroup><tbody></tbody>").appendTo(_table);
            var _trTag = $("<tr />");
            for (var i = 0; i < tableArray[0].rows[0].attributes.length; i++) {
                if (tableArray[0].rows[0].attributes[i].name !== "id") {
                    _trTag.attr(tableArray[0].rows[0].attributes[i].name, tableArray[0].rows[0].attributes[i].value);
                }
            }
            var _tdTag = $("<td itemtype='Cell' controltype='Cell' friendlyname='' layout='Cell' />");
            for (var i = 0; i < tableArray[0].rows[0].cells[0].attributes.length; i++) {
                if (tableArray[0].rows[0].cells[0].attributes[i].name !== "id" && tableArray[0].rows[0].cells[0].attributes[i].name !== "width") {
                    _tdTag.attr(tableArray[0].rows[0].cells[0].attributes[i].name, tableArray[0].rows[0].cells[0].attributes[i].value);
                }
            }
            designTD = _tdTag;
            for (var i = 0; i < _rowCount; i++) {
                var rid = String.generateGuid();
                var rcn = this._getControlNode(rid, "Row", controlXML);
                var _tr = $(_trTag[0].outerHTML);
                _tr.attr("id", rid);
                for (var j = 0; j < _columnCount; j++) {
                    var cid = String.generateGuid();
                    var ccn = this._getControlNode(rid, "Cell", controlXML);
                    var _td = $(_tdTag[0].outerHTML);
                    _td.attr("id", cid);
                    if (designer !== SourceCode.Forms.Designers.Form) {
                        designer.DesignerTable._addCellProperties(_td, designer);
                    }
                    _tr.append(_td);
                }
                _table.append(_tr);
            }
            var modulus = 100 % _columnCount;
            var _colwidth = Math.floor(100 / _columnCount);
            for (var i = 0; i < _columnCount; i++) {
                var _w = _colwidth + (modulus > 0 ? 1 : 0);
                modulus--;
                var colid = String.generateGuid();
                var _col = $("<col id='" + colid + "' style='width:" + _w + "%;'/>").appendTo(_table.children("colgroup"));
            }
            _table[0].cols = _columnCount;
            this.designTableArrays[_table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(_table);
            if (designer !== SourceCode.Forms.Designers.Form && SourceCode.Forms.Designers.View.ViewDesigner._getViewType() === "CaptureList") {
                _table.addClass("toolbar inner");
            }
            _columnCount = null;
            _rowCount = null;
            _table.outerHTML(_table.outerHTML().replaceSpacesBetweenTags());
            return _table;
        },
        _getControlNode: function(id, type, controlXML) {
            var controlsNode = controlXML;
            if (controlsNode === null)
                controlsNode = controlXML.documentElement.appendChild(controlXML.documentElementl.createElement("Controls"));
            var controlNode = controlXML;
            if (controlNode === null) {
                var cname = SourceCode.Forms.Designers.generateUniqueControlName(id, "", type, controlsNode);
                controlNode = controlsNode.appendChild(controlXML.createElement("Control"));
                controlNode.setAttribute("ID", id);
                controlNode.setAttribute("Type", type);
                controlNode.appendChild(controlXML.createElement("Name")).appendChild(controlXML.createTextNode(id));
                var controlPropsNode = controlNode.appendChild(controlXML.createElement("Properties"));
                var controlNamePropsNode = controlPropsNode.appendChild(controlXML.createElement("Property"));
                controlNamePropsNode.appendChild(controlXML.createElement("Name")).appendChild(controlXML.createTextNode("ControlName"));
                controlNamePropsNode.appendChild(controlXML.createElement("Value")).appendChild(controlXML.createTextNode(cname));
            }
            return controlNode;
        },
        _addRow: function(options, designer) {
            var position = options.position;
            var contextObj = jQuery(options.contextobject);
            if (contextObj.length > 0) {
                var section = this._getSection(contextObj);
                var index = 0;
                if (!contextObj.is('td')) {
                    contextObj = this._getParentTD(contextObj);
                }
                var table = this._getParentTable(contextObj);
                var tableArray = this.designTableArrays[table.attr("id")];
                if (!checkExists(tableArray)) {
                    this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
                    tableArray = this.designTableArrays[table.attr("id")];
                }
                if (contextObj.length > 0) {
                    var rows = table.find('>tbody>tr');
                    var tbody;
                    if (designer === SourceCode.Forms.Designers.Form || designer.DesignerTable.ViewDesigner._getViewType() === "Capture" || designer.DesignerTable.ViewDesigner._getViewType() !== "CaptureList:not(.toolbar)") {
                        this._addItemViewRow(table, position, contextObj, designer);
                        return;
                    }
                    if (contextObj.parent().is('tr')) {
                        index = contextObj.parent()[0].rowIndex;
                        tbody = contextObj.parent().parent();
                    } else {
                        index = contextObj.offsetParent().parent()[0].rowIndex;
                        tbody = contextObj.offsetParent().parent().parent();
                    }
                    var row = jQuery('<tr/>');
                    var rowId = new String().generateGuid();
                    row.attr('id', rowId);
                    row.attr('layouttype', 'row');
                    var cols = this._TableColumnCount(table);
                    for (var i = 0; i < cols; i++) {
                        var cell = jQuery('<td/>');
                        var colId = new String().generateGuid();
                        cell.attr('id', colId);
                        row.append(cell);
                        SourceCode.Forms.Controls.Web.TableBehavior.prototype._configureCell(section.attr('id'), row, cell, null, null, designer);
                    }
                    var thisSibling = jQuery(rows[index]);
                    if (position === 'before') {
                        if (thisSibling.length > 0) {
                            row.insertBefore(thisSibling);
                        } else {
                            tbody.append(row);
                        }
                    } else if (position === 'after') {
                        if (thisSibling.length > 0) {
                            row.insertAfter(thisSibling);
                        } else {
                            tbody.append(row);
                        }
                    } else if (position === 'append') {
                        tbody.append(row);
                    }
                    designer.ViewDesigner.isViewChanged = true;
                    $('#toolRemoveRow').removeClass('disabled');
                    this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
                    return row;
                }
            }
        },
        _addColumn: function(options, designer) {
            var position = options.position;
            var contextObj = options.contextobject;
            var sibling;
            var index = 0;
            var section = this._getSection(contextObj);
            var headerCell;
            if (contextObj.length > 0) {
                if (contextObj.is('td')) {
                    sibling = contextObj;
                } else {
                    sibling = this._getParentTD(contextObj);
                }
                if (sibling.length === 0)
                    return;
                var table = this._getParentTable(sibling);
                if (table.length === 0)
                    return;
                if (designer !== SourceCode.Forms.Designers.Form && designer.DesignerTable.ViewDesigner._getViewType() === "CaptureList" && section[0].id !== "toolbarSection") {
                    jQuery(".column-selected-overlay").hide();
                    jQuery("div.drag-block").hide();
                } else {
                    this._addItemViewColumn(options, table, contextObj, designer);
                    return;
                }
                index = sibling[0].cellIndex;
                var tableID = table.attr("id");
                var jq_ColGroup = jQuery("#" + tableID).find("colgroup");
                var jq_columnResizeWrapperDiv = jQuery("#" + tableID + "_columnResizeWrapperDiv");
                var jq_Col = jQuery("<col id='" + String.generateGuid() + "' />");
                var jq_dragDiv = jQuery("<div id='" + String.generateGuid() + "' class='drag-column'><div class='drag-block'></div></div>");
                jq_dragDiv.data("tableID", tableID);
                var jColumns = jq_ColGroup.children();
                var currentColumn = jQuery(jColumns[index]);
                var currentCell = table.find(">tbody>tr:nth-child(1)>td:nth-child({0})".format(index + 1));
                var minColumnWidth = 50;
                if (currentCell.outerWidth(true) < minColumnWidth) {
                    var found = false;
                    for (i = index + 1; i < jColumns.length; i++) {
                        var nextCol = jQuery(jColumns[i]);
                        var nextCell = table.find(">tbody>tr:nth-child(1)>td:nth-child({0})".format(i + 1));
                        if (nextCell.outerWidth(true) >= minColumnWidth) {
                            currentColumn = nextCol;
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        for (i = index - 1; i >= 0; i--) {
                            var prevCol = jQuery(jColumns[i]);
                            var prevCell = table.find(">tbody>tr:nth-child(1)>td:nth-child({0})".format(i + 1));
                            if (prevCell.outerWidth(true) >= minColumnWidth) {
                                currentColumn = prevCol;
                                found = true;
                                break;
                            }
                        }
                    }
                }
                var newWidth = parseFloat(currentColumn[0].style.width) / 2;
                currentColumn[0].style.width = "{0}%".format(newWidth);
                jq_Col[0].style.width = "{0}%".format(newWidth);
                var rows = table.find('>tbody>tr');
                var cols = this._TableColumnCount(table);
                var colsum = 0;
                for (var i = 0; i < rows.length; i++) {
                    var thisRow = jQuery(rows[i]);
                    if (thisRow.hasClass("placeholder-footer")) {
                        continue;
                    }
                    var cell = jQuery('<td></td>');
                    var colId = new String().generateGuid();
                    cell.attr('id', colId);
                    if (i === 0) {
                        headerCell = cell;
                    }
                    if (designer !== SourceCode.Forms.Designers.Form && designer.DesignerTable.View.SelectedViewType === "CaptureList" && i === 0) {
                        cell.addClass("header");
                    }
                    var thisCell = jQuery(thisRow.find('>td')[index]);
                    var nextCell = null;
                    var prevCell = null;
                    var thisCellWidth = thisCell.outerWidth();
                    var thisCellHasAlternate = thisCell.hasClass('alternate');
                    switch (position) {
                    case 'before':
                        if (thisCell.length > 0) {
                            cell.insertBefore(thisCell);
                        } else {
                            thisRow.append(cell);
                        }
                        break;
                    case 'after':
                        if (thisCell.length > 0) {
                            cell.insertAfter(thisCell);
                        } else {
                            thisRow.append(cell);
                        }
                        break;
                    case 'append':
                        thisRow.append(cell);
                        break;
                    }
                    if (i === 0) {
                        var cells = cell.parent().children();
                        var ciblings = cell.siblings();
                        if (cell.next().length > 0) {
                            jq_Col.insertBefore(jq_ColGroup.children().eq(cells.index(cell[0])));
                            jq_dragDiv.insertBefore(jq_columnResizeWrapperDiv.children().eq(cells.index(cell[0]) - 1));
                        } else {
                            jq_Col.appendTo(jq_ColGroup);
                            jq_dragDiv.appendTo(jq_columnResizeWrapperDiv);
                        }
                        this._makeColumnDraggable(jq_dragDiv, designer);
                        $("#toolRemoveCol").removeClass('disabled');
                    }
                    if (thisCellHasAlternate) {
                        cell.addClass('alternate');
                    }
                    if (section.length > 0) {
                        SourceCode.Forms.Controls.Web.TableBehavior.prototype._configureCell(section.attr('id'), thisRow, cell, null, null, designer);
                    } else {
                        SourceCode.Forms.Controls.Web.TableBehavior.prototype._configureCell('', thisRow, cell, null, null, designer);
                    }
                }
                SourceCode.Forms.Designers.View.DesignerTable._coerceListViewColumnSizes(table);
                if (designer.DesignerTable.View.SelectedViewType === 'CaptureList') {
                    if (SourceCode.Forms.Designers.View.selectedOptions.EnableListEditing) {
                        SourceCode.Forms.Designers.View.DesignerTable._addEditableColumn(index, (100 - colsum), position, jq_ColGroup);
                    }
                    if (SourceCode.Forms.Designers.View.DesignerTable.View.selectedObject !== null && SourceCode.Forms.Designers.View.DesignerTable.View.selectedObject.is(":not(.editor-canvas)")) {
                        SourceCode.Forms.Designers.View.DesignerTable._setupColumnOverlay(SourceCode.Forms.Designers.View.DesignerTable.View.selectedObject);
                    }
                    SourceCode.Forms.Designers.View.DesignerTable._synchronizeEditableColumns();
                }
                var xmlDoc = SourceCode.Forms.Designers.View.viewDefinitionXML;
                var containerId = table.closest("div.controlwrapper").attr("ID");
                SourceCode.Forms.Designers.View.ViewDesigner._BuildColumnXML(xmlDoc, containerId, jq_Col, null);
                SourceCode.Forms.Controls.Web.TableBehavior.prototype._positionHandlers();
                this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
            }
            if ($chk(SourceCode.Forms.Designers.View.DesignerTable.View.propertyGrid)) {
                designer.ViewDesigner.isViewChanged = true;
                var selectedIndex = index + (position === "before" ? +1 : -1);
                designer.ViewDesigner._configSelectedControl($(contextObj));
                SourceCode.Forms.Designers.View.DesignerTable.View.PropertyGrid.refresh();
            }
            return headerCell;
        },
        _addItemViewRow: function(table, position, selectedCell, designer) {
            var tableArray = this.designTableArrays[table.attr("id")];
            var section = this._getSection(selectedCell);
            var cellOperations = SourceCode.Forms.Designers.insertRow(tableArray, selectedCell, position);
            var rowIndex = selectedCell.parent()[0].rowIndex;
            if (cellOperations[0].action === "adjustRow") {
                rowIndex = cellOperations[0].row;
                cellOperations.splice(0, 1);
            }
            var rows = table.find(">tbody>tr");
            var row = jQuery(rows[rowIndex]);
            var newRow = jQuery("<tr></tr>");
            newRow.attr("id", new String().generateGuid());
            newRow.attr("layouttype", "row");
            newRow.addClass("editor-row");
            for (var i = 0; i < cellOperations.length; i++) {
                var operation = cellOperations[i];
                if (operation.action === "increaseRow") {
                    var rowCell = jQuery(rows[operation.row]).find("td[id={0}]".format(operation.elementId));
                    rowCell.attr("rowSpan", rowCell[0].rowSpan + 1);
                } else if (operation.action === "addCell") {
                    var newCell = jQuery("<td>&nbsp;</td>");
                    newCell.attr("id", new String().generateGuid());
                    if (section.length > 0) {
                        SourceCode.Forms.Controls.Web.TableBehavior.prototype._configureCell(section.attr('id'), row, newCell, null, null, designer);
                    } else {
                        SourceCode.Forms.Controls.Web.TableBehavior.prototype._configureCell('', row, newCell, null, null, designer);
                    }
                    if (operation.colSpan > 1) {
                        newCell.attr("colSpan", operation.colSpan);
                    }
                    newRow.append(newCell);
                }
            }
            if (position === "before") {
                row.before(newRow);
            } else if (position === "after") {
                row.after(newRow);
            }
            this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
            if (designer !== SourceCode.Forms.Designers.Form) {
                designer.ViewDesigner.isViewChanged = true;
                designer.ViewDesigner._setSelectedObject(selectedCell);
                designer.ViewDesigner._setupToolbar(selectedCell);
            }
        },
        _addItemViewColumn: function(options, table, selectedCell, designer) {
            var tableArray = this.designTableArrays[table.attr("id")];
            if (checkExists(tableArray)) {
                this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
                tableArray = this.designTableArrays[table.attr("id")];
            }
            var position = options.position;
            var rowIndex = selectedCell.parent()[0].rowIndex;
            var colIndex = SourceCode.Forms.Designers.getTableArrayColumnIndex(tableArray, selectedCell);
            var insertIndexes = SourceCode.Forms.Designers.insertColumn(tableArray, selectedCell, position);
            var columnResizeWrapperDiv = jQuery("#{0}_columnResizeWrapperDiv".format(table.attr("id")));
            var newDragDiv = jQuery("<div id='{0}' class='drag-column'><div class='drag-block'></div></div>".format(String.generateGuid()));
            newDragDiv.data("tableID", table.attr("id"));
            var pivotDragDiv = columnResizeWrapperDiv.children().eq(colIndex);
            if (pivotDragDiv.length === 0) {
                pivotDragDiv = columnResizeWrapperDiv.children().eq(0);
            }
            var newColumn = jQuery("<col id='{0}' />".format(String.generateGuid()));
            var pivotColumn = table.find(">colgroup>col:nth-child({0})".format(colIndex + 1));
            var newWidth = Number(pivotColumn[0].style.width.replace("%", "")) / 2;
            pivotColumn[0].style.width = "{0}%".format(newWidth);
            newColumn[0].style.width = "{0}%".format(newWidth);
            if (pivotDragDiv.length > 0) {
                if (position === "after") {
                    pivotDragDiv.after(newDragDiv);
                    pivotColumn.after(newColumn);
                } else if (position === "before") {
                    pivotDragDiv.before(newDragDiv);
                    pivotColumn.before(newColumn);
                }
            } else {
                columnResizeWrapperDiv.append(newDragDiv);
                if (position === "after") {
                    pivotColumn.after(newColumn);
                } else if (position === "before") {
                    pivotColumn.before(newColumn);
                }
            }
            this._makeColumnDraggable(newDragDiv, designer);
            var section = this._getSection(selectedCell);
            var rows = table.find(">tbody>tr");
            for (i = 0; i < rows.length; i++) {
                var row = jQuery(rows[i]);
                var newCell = jQuery("<td>&nbsp;</td>");
                newCell.attr("id", new String().generateGuid());
                var refCell = row.children("td:nth-child({0})".format(insertIndexes[i] + 1));
                if (position === "after") {
                    refCell.after(newCell);
                } else if (position === "before") {
                    refCell.before(newCell);
                }
                if (section.length > 0) {
                    SourceCode.Forms.Controls.Web.TableBehavior.prototype._configureCell(section.attr('id'), row, newCell, null, null, designer);
                } else {
                    SourceCode.Forms.Controls.Web.TableBehavior.prototype._configureCell('', row, newCell, null, null, designer);
                }
            }
            SourceCode.Forms.Controls.Web.TableBehavior.prototype._positionHandlers();
            this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
            if (designer !== SourceCode.Forms.Designers.Form) {
                designer.ViewDesigner._setSelectedObject(selectedCell);
                designer.ViewDesigner._setupToolbar(selectedCell);
            }
        },
        _configureCell: function(section, tr, td, width, height, designer) {
            if (checkExists(td)) {
                tr = jQuery(tr);
                td = jQuery(td);
                td.unbind();
                var notDummyData = !tr.hasClass("dummy-row");
                if (designer !== SourceCode.Forms.Designers.Form && notDummyData) {
                    designer.DesignerTable._addCellProperties(td);
                }
                td.addClass('editor-cell');
                td.addClass('droptarget');
                if (td.html() === '') {
                    td.html('&nbsp;');
                }
                return td;
            }
        },
        _mergeRight: function(contextobject, designer) {
            if (contextobject.length > 0) {
                if (!contextobject.is('td')) {
                    contextobject = this._getParentTD(contextobject);
                }
                var span = contextobject.attr('colspan');
                var index = contextobject[0].cellIndex;
                var siblingIndex;
                var row = contextobject.parent();
                if (row.length > 0) {
                    var rowIndex = row[0].rowIndex;
                    if (!checkExists(span)) {
                        span = 1;
                    }
                    var cells = row.find('>td');
                    var sibling = contextobject.next();
                    var nextTdhildControls;
                    if (sibling.length > 0) {
                        var tdControls;
                        if (designer !== SourceCode.Forms.Designers.Form) {
                            nextTdhildControls = sibling.find('>.controlwrapper,>.non-breaking-space ,>.line-break');
                            tdControls = contextobject.find('.controlwrapper');
                        } else {
                            nextTdhildControls = sibling.find('>.form-control,>.non-breaking-space ,>.line-break');
                            tdControls = contextobject.find('.form-control');
                        }
                        if (tdControls.length > 0 && nextTdhildControls.length > 0) {
                            var br = jQuery("<br layouttype='line-break' class='line-break' />");
                            contextobject.append(br);
                        }
                        if (nextTdhildControls.length > 0) {
                            nextTdhildControls.appendTo(contextobject);
                        }
                        var siblingSpan = sibling.attr('colspan');
                        if (!checkExists(siblingSpan)) {
                            span++;
                        } else {
                            span = Number(span) + Number(siblingSpan);
                        }
                        contextobject.attr('colspan', span);
                        sibling.remove();
                        var table = this._getParentTable(contextobject);
                        var rowIndex = $(table).find(">tbody>tr").index(row);
                        this._removeEmptyColumns($(table), index, rowIndex);
                        this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
                        SourceCode.Forms.Controls.Web.TableBehavior.prototype._positionHandlers();
                        if (designer !== SourceCode.Forms.Designers.Form) {
                            designer.ViewDesigner._setupToolbar(contextobject);
                            designer.ViewDesigner.isViewChanged = true;
                        }
                    }
                }
            }
        },
        _mergeBottom: function(contextobject, designer) {
            if (contextobject.length > 0) {
                if (!contextobject.is('td')) {
                    contextobject = this._getParentTD(contextobject);
                }
                var table = this._getParentTable(contextobject);
                var tableArray = this.designTableArrays[table.attr("id")];
                var cellLocation = SourceCode.Forms.Designers._getMergeDownCellLocation(tableArray, contextobject);
                if (checkExists(cellLocation)) {
                    var cellToMergeWith = table.find(">tbody>tr:nth-child({0})>td:nth-child({1})".format(cellLocation.row + 1, cellLocation.col + 1));
                    if (cellToMergeWith.length > 0) {
                        var tdControls;
                        if (designer !== SourceCode.Forms.Designers.Form) {
                            nextTDChildControls = cellToMergeWith.find('>.controlwrapper, >.non-breaking-space, >.line-break');
                            tdControls = contextobject.find('.controlwrapper');
                        } else {
                            nextTDChildControls = cellToMergeWith.find('>.form-control, >.non-breaking-space, >.line-break');
                            tdControls = contextobject.find('.form-control');
                        }
                        if (tdControls.length > 0 && nextTDChildControls.length > 0) {
                            var br = jQuery("<br layouttype='line-break' class='line-break' />");
                            contextobject.append(br);
                        }
                        if (nextTDChildControls.length > 0) {
                            nextTDChildControls.appendTo(contextobject);
                        }
                        var row = cellToMergeWith.parent();
                        contextobject[0].rowSpan = contextobject[0].rowSpan + cellToMergeWith[0].rowSpan;
                        cellToMergeWith.remove();
                        this._removeEmptyRows(table);
                    }
                }
                this.designTableArrays[contextobject.closest(".editor-table").attr("id")] = SourceCode.Forms.Designers.generateTableArray(contextobject.closest(".editor-table"));
                if (designer !== SourceCode.Forms.Designers.Form) {
                    designer.ViewDesigner.isViewChanged = true;
                    designer.ViewDesigner._setupToolbar(contextobject);
                }
            }
        },
        _removeEmptyColumns: function(table, colIndex, rowIndex) {
            var cell = $(table.find(">tbody>tr")[rowIndex].cells[colIndex]);
            var rows = table.find(">tbody>tr");
            var realPos = {
                'col': cell.cellPos(true).left,
                'row': cell.cellPos(true).top
            };
            var colspanCount = rows[rowIndex].cells[colIndex].colSpan;
            var removeCol = false;
            var colArray = [];
            var rowspan = 1;
            for (var r = 0; r < rows.length; r++) {
                var thisCellPos = 0;
                var truePos = 0;
                if (rowspan <= 1) {
                    for (var c = 0; c < rows[r].cells.length; c++) {
                        var tempCell = $(table.find(">tbody>tr")[r].cells[c]);
                        thisCellPos = {
                            'col': tempCell.cellPos().left,
                            'row': tempCell.cellPos().top
                        };
                        if (thisCellPos.col === realPos.col) {
                            truePos = c;
                            break;
                        }
                    }
                    if (rows[r].cells[truePos].colSpan !== colspanCount) {
                        removeCol = false;
                        break;
                    } else {
                        rowspan = rows[r].cells[truePos].rowSpan;
                        removeCol = true;
                        colArray.push({
                            'col': truePos,
                            'row': r
                        });
                    }
                } else {
                    rowspan--;
                }
            }
            if (removeCol === true) {
                var colGroup = $(table.find(">colgroup>col"));
                var tempColCount = colspanCount;
                var tableId = table.attr("id");
                for (var c = colspanCount - 1; tempColCount > 1; c--) {
                    var thisColWidth = colGroup[realPos.col].style.width;
                    var nextColWidth = checkExists(colGroup[realPos.col + c]) ? colGroup[realPos.col + c].style.width : "";
                    if (thisColWidth.indexOf("%") >= 0) {
                        thisColWidth = thisColWidth.replace("%", "");
                    }
                    if (nextColWidth.indexOf("%") >= 0) {
                        nextColWidth = nextColWidth.replace("%", "");
                    }
                    var colWidth = parseFloat(thisColWidth) + parseFloat(nextColWidth);
                    $(colGroup[realPos.col]).css("width", colWidth + "%");
                    $(colGroup[realPos.col + c]).remove();
                    var columnIndex = realPos.col;
                    var columnResizeWrapperDiv = jQuery("#{0}_columnResizeWrapperDiv".format(tableId));
                    $(columnResizeWrapperDiv.children()[columnIndex]).remove();
                    tempColCount--;
                }
                for (var r = 0; r < colArray.length; r++) {
                    var newSpan = rows[colArray[r].row].cells[colArray[r].col].colSpan - colspanCount + 1;
                    rows[colArray[r].row].cells[colArray[r].col].colSpan = newSpan;
                    if (rows[colArray[r].row].cells[colArray[r].col].colSpan === 1) {
                        $(rows[colArray[r].row].cells[colArray[r].col]).removeAttr("colspan");
                    }
                }
            }
        },
        _removeEmptyRows: function(table) {
            var rowsToRemove = [];
            var rows = table.find(">tbody>tr");
            var len = rows.length;
            var rowsToChange = [];
            for (var i = 0; i < len; i++) {
                var row = rows.eq(i);
                if (row.children("td").length === 0) {
                    var rowIndex = rows.index(row)
                    for (var r = 0; r < rowIndex; r++) {
                        rowsToChange.push(rows[r]);
                    }
                    for (var j = 0; j < rowsToChange.length; j++) {
                        var indexAbove = rowIndex - rows.index(rows[j]);
                        var cells = rows.eq(j).find(">td");
                        for (var z = 0; z < cells.length; z++) {
                            var cell = cells[z];
                            if (cell.rowSpan > indexAbove) {
                                cell.rowSpan = cell.rowSpan - 1;
                            }
                        }
                    }
                    rowsToRemove.push(row);
                }
            }
            len = rowsToRemove.length;
            for (i = 0; i < len; i++) {
                jQuery(rowsToRemove[i]).remove();
            }
        },
        scanTable: function($table) {
            var m = [];
            $table.children("tr").each(function(y, row) {
                $(row).children("td, th").each(function(x, cell) {
                    var $cell = $(cell), cspan = $cell.attr("colspan") | 0, rspan = $cell.attr("rowspan") | 0, tx, ty;
                    cspan = cspan ? cspan : 1;
                    rspan = rspan ? rspan : 1;
                    for (; m[y] && m[y][x]; ++x)
                        ;
                    for (tx = x; tx < x + cspan; ++tx) {
                        for (ty = y; ty < y + rspan; ++ty) {
                            if (!m[ty]) {
                                m[ty] = [];
                            }
                            m[ty][tx] = true;
                        }
                    }
                    var pos = {
                        top: y,
                        left: x
                    };
                    $cell.data("cellPos", pos);
                });
            });
        },
        _clearCell: function(contextobject, designer) {
            if (contextobject) {
                if (contextobject.length > 0) {
                    if (!contextobject.is('td')) {
                        contextobject = this._getParentTD(contextobject);
                        if (contextobject.length === 0) {
                            return;
                        }
                    }
                    var defXml = this._getDefinitonXML(designer);
                    SourceCode.Forms.DependencyHelper._ensureDefinitionIsUpToDate(defXml);
                    function _doClearCellFn() {
                        SourceCode.Forms.Controls.Web.TableBehavior.prototype._doClearCell(contextobject, designer);
                    }
                    ;var cellsData = [{
                        itemId: contextobject[0].id,
                        itemType: SourceCode.Forms.DependencyHelper.ReferenceType.Cell
                    }];
                    var controlInCellDataArray = SourceCode.Forms.Designers.getControlDataCollectionForContainerControl(cellsData[0]);
                    if (controlInCellDataArray.length > 0) {
                        cellsData = $.merge(cellsData, controlInCellDataArray);
                    }
                    var cellDependencies = SourceCode.Forms.Designers.getDependencies(cellsData, {
                        skipDefinitionUpdate: true
                    });
                    if (cellDependencies.length > 0) {
                        var notifierOptions = {
                            references: cellDependencies,
                            deleteItemType: SourceCode.Forms.DependencyHelper.ReferenceType.Cell,
                            removeObjFn: _doClearCellFn
                        };
                        SourceCode.Forms.Designers.showDependencyNotifierPopup(notifierOptions);
                    } else {
                        this._doClearCell(contextobject, designer);
                    }
                }
            }
        },
        _doClearCell: function(contextobject, designer) {
            var _tableBehavior = SourceCode.Forms.Controls.Web.TableBehavior.prototype;
            var parentRow = contextobject.closest("tr");
            _tableBehavior._cleanupChildren(designer, contextobject);
            var section = _tableBehavior._getSection(contextobject);
            contextobject.empty();
            if (section.length > 0 && section[0].id === "toolbarSection") {
                var cellWatermarkText = jQuery('<div class="watermark-text">' + Resources.ViewDesigner.DragControlHereWatermark + '</div>');
                contextobject.append(cellWatermarkText);
                SourceCode.Forms.Designers.View.ViewDesigner.DragDrop._ToggleContextWaterMark(contextobject);
            }
            _tableBehavior._configureCell(section.attr('id'), contextobject.parent(), contextobject, null, null, designer);
            _tableBehavior._SetRowCellLayout(contextobject.parent());
            if (designer !== SourceCode.Forms.Designers.Form && designer.DesignerTable.View.SelectedViewType === "CaptureList" && parentRow.hasClass("footer")) {
                var parentTable = parentRow.closest("table");
                var tableArray = _tableBehavior.designTableArrays[parentTable.attr("id")];
                if (tableArray === undefined) {
                    _tableBehavior.designTableArrays[parentTable.attr("id")] = SourceCode.Forms.Designers.generateTableArray(parentTable);
                    tableArray = _tableBehavior.designTableArrays[parentTable.attr("id")];
                }
                var rows = parentTable.find("tbody>tr");
                if (parentRow[0].rowIndex !== rows.length - 1) {
                    var rowControls = parentRow.find(">td div.controlwrapper");
                    if (rowControls.length === 0) {
                        _tableBehavior._removeRow(parentRow.find(">td:first-child"), designer);
                    }
                }
            }
            if (designer !== SourceCode.Forms.Designers.Form) {
                designer.ViewDesigner._setDefaultSelectedObject();
                designer.ViewDesigner._setupToolbar();
                designer.ViewDesigner.isViewChanged = true;
            } else {
                designer.steps[designer.LAYOUT_STEP_INDEX].setDefaultSelectedObject();
            }
        },
        _clearTable: function(contextobject, designer) {
            var $control = contextobject;
            var $table = $control.find('table').first();
            var tableId = $table[0].id;
            var tableName = "";
            var nameNode = designer.definitionXml.selectSingleNode("//Control[@ID='{0}']/Properties/Property[Name='ControlName']/DisplayValue".format(tableId));
            var defXml = this._getDefinitonXML(designer);
            SourceCode.Forms.DependencyHelper._ensureDefinitionIsUpToDate(defXml);
            if (checkExists(nameNode)) {
                tableName = nameNode.text;
            }
            var _clearTableFn = function() {
                SourceCode.Forms.Designers.Common.Context.removeControl($table);
            }
            var tableData = [{
                itemId: tableId,
                itemType: SourceCode.Forms.DependencyHelper.ReferenceType.Table
            }];
            var controlsInTableDataArray = SourceCode.Forms.Designers.getControlDataCollectionForContainerControl(tableData[0]);
            if (controlsInTableDataArray.length > 0) {
                tableData = $.merge(tableData, controlsInTableDataArray);
            }
            var tableDependencies = SourceCode.Forms.Designers.getDependencies(tableData, {
                skipDefinitionUpdate: true
            });
            if (tableDependencies.length > 0) {
                var notifierOptions = {
                    references: tableDependencies,
                    deleteItemType: SourceCode.Forms.DependencyHelper.ReferenceType.Table,
                    removeObjFn: _clearTableFn
                };
                SourceCode.Forms.Designers.showDependencyNotifierPopup(notifierOptions);
            } else {
                popupManager.showConfirmation({
                    message: Resources.FormDesigner.ClearTableConfirmation,
                    onAccept: function() {
                        _clearTableFn();
                        popupManager.closeLast();
                    }
                });
            }
        },
        _clearRow: function(contextobject, designer) {
            if (contextobject.length > 0) {
                if (!contextobject.is('td')) {
                    contextobject = this._getParentTD(contextobject);
                }
                if (contextobject.length > 0) {
                    var row = contextobject.parent();
                    if (checkExists(row) && row.length > 0) {
                        if (row.is('tr')) {
                            this._clearCells(row, designer);
                        }
                    }
                }
            }
        },
        _clearCells: function(row, designer) {
            if (row.length > 0) {
                var _this = this;
                var defXml = this._getDefinitonXML(designer);
                SourceCode.Forms.DependencyHelper._ensureDefinitionIsUpToDate(defXml);
                var _doClearCellsFn = function() {
                    var rowChildren = row.children();
                    for (i = 0; i < rowChildren.length; i++) {
                        var cell = jQuery(rowChildren[i]);
                        if (cell.is('td')) {
                            _this._clearCell(cell, designer);
                        }
                    }
                    if (designer !== SourceCode.Forms.Designers.Form) {
                        designer.ViewDesigner.isViewChanged = true;
                    } else {
                        row.find('.form-control').remove();
                    }
                };
                var rowData = [{
                    itemId: row[0].id,
                    itemType: SourceCode.Forms.DependencyHelper.ReferenceType.Row
                }];
                var controlsInRowDataArray = SourceCode.Forms.Designers.getControlDataCollectionForContainerControl(rowData[0]);
                if (controlsInRowDataArray.length > 0) {
                    rowData = $.merge(rowData, controlsInRowDataArray);
                }
                var rowDependencies = SourceCode.Forms.Designers.getDependencies(rowData, {
                    skipDefinitionUpdate: true
                });
                if (rowDependencies.length > 0) {
                    var notifierOptions = {
                        references: rowDependencies,
                        deleteItemType: SourceCode.Forms.DependencyHelper.ReferenceType.Row,
                        removeObjFn: _doClearCellsFn
                    };
                    SourceCode.Forms.Designers.showDependencyNotifierPopup(notifierOptions);
                } else {
                    _doClearCellsFn();
                }
            }
        },
        _SetRowCellLayout: function(row) {
            if (row.length > 0) {
                var rowChildren = row.children();
                var cellCount = rowChildren.length;
                var dynamicCellCount = 0;
                for (var i = 0; i < cellCount; i++) {
                    var cell = jQuery(rowChildren[i]);
                    var width = cell[0].style.width;
                    if (width === '' || width.indexOf('%') >= 0 || width === '0px' || width === 'auto') {
                        dynamicCellCount++;
                    }
                }
                for (var j = 0; j < cellCount; j++) {
                    var cell = jQuery(rowChildren[j]);
                    var width = cell[0].style.width;
                    if (width === '' || width.indexOf('%') >= 0 || width === '0px' || width === 'auto') {
                        if (dynamicCellCount > 1) {
                            cell[0].style.width = (100 / dynamicCellCount) + '%';
                        } else {
                            cell[0].style.width = "";
                        }
                    }
                }
            }
        },
        _removeItemViewColumn: function(table, selectedCell, designer) {
            var tableArray = this.designTableArrays[table.attr("id")];
            if (!checkExists(tableArray)) {
                this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
                tableArray = this.designTableArrays[table.attr("id")];
            }
            var columnIndex = SourceCode.Forms.Designers.getTableArrayColumnIndex(tableArray, selectedCell);
            var removeIndexes = SourceCode.Forms.Designers.removeColumn(tableArray, selectedCell);
            var affectedCells = [];
            var rows = table.find(">tbody>tr");
            var cellsData = [];
            var defXml = this._getDefinitonXML(designer);
            SourceCode.Forms.DependencyHelper._ensureDefinitionIsUpToDate(defXml);
            for (var i = 0; i < removeIndexes.length; i++) {
                var index = removeIndexes[i];
                if (index > -1) {
                    var cell = jQuery(rows[i]).children("td:nth-child({0})".format(index + 1));
                    if (checkExists(cell)) {
                        affectedCells.push(cell);
                        var cellData = {
                            itemId: cell[0].id,
                            itemType: SourceCode.Forms.DependencyHelper.ReferenceType.Cell
                        };
                        cellsData.push(cellData);
                        var controlsInCellDataArray = SourceCode.Forms.Designers.getControlDataCollectionForContainerControl(cellData);
                        if (controlsInCellDataArray.length > 0) {
                            cellsData = $.merge(cellsData, controlsInCellDataArray);
                        }
                    }
                }
            }
            var _this = this;
            var deleteColumnFn = function() {
                _this._deleteColumn(table, affectedCells, columnIndex, designer);
            }
            var cellDependencies = SourceCode.Forms.Designers.getDependencies(cellsData, {
                skipDefinitionUpdate: true
            });
            if (cellDependencies.length > 0) {
                var notifierOptions = {
                    references: cellDependencies,
                    deleteItemType: SourceCode.Forms.DependencyHelper.ReferenceType.Column,
                    removeObjFn: deleteColumnFn
                };
                SourceCode.Forms.Designers.showDependencyNotifierPopup(notifierOptions);
            } else {
                deleteColumnFn();
            }
        },
        _deleteColumn: function(table, cells, columnIndex, designer) {
            var rows = table.find(">tbody>tr");
            for (var i = 0; i < rows.length; i++) {
                var cell = cells[i];
                if (checkExists(cell)) {
                    if (!checkExists(cell.attr("colSpan"))) {
                        this._cleanupChildren(designer, cell, true);
                        cell.remove();
                    } else {
                        var colSpan = Number(cell.attr("colSpan"));
                        if (colSpan > 1) {
                            var newSpan = colSpan - 1;
                            if (newSpan <= 1) {
                                cell.removeAttr("colSpan");
                            } else {
                                cell.attr("colSpan", newSpan);
                            }
                        } else {
                            this._cleanupChildren(designer, cell, true);
                            cell.remove();
                        }
                    }
                }
                this._removeEmptyRows(table);
            }
            var tableId = table.attr("id");
            var columns = table.find(">colgroup>col");
            var currentColumn = columns[columnIndex];
            var columnId = currentColumn.id;
            var column = null;
            if (columnIndex === this.designTableArrays[table.attr("id")][0].length - 1) {
                column = columns[columnIndex - 1];
            } else {
                column = columns[columnIndex + 1];
            }
            var currentColumn = table.find(">colgroup>col:nth-child({0})".format(columnIndex + 1));
            var size = Number(currentColumn[0].style.width.replace("%", ""));
            if (checkExists(column)) {
                var newColumnSize = Number(column.style.width.replace("%", ""));
                column.style.width = newColumnSize + size + '%';
            }
            currentColumn.remove();
            var columnResizeWrapperDiv = jQuery("#{0}_columnResizeWrapperDiv".format(tableId));
            $(columnResizeWrapperDiv.children()[columnIndex]).remove();
            table.addClass("superfluous");
            table.removeClass("superfluous");
            SourceCode.Forms.Controls.Web.TableBehavior.prototype._positionHandlers();
            this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
            if (designer !== SourceCode.Forms.Designers.Form) {
                designer.ViewDesigner._setDefaultSelectedObject();
                designer.ViewDesigner._setupToolbar();
                designer.ViewDesigner.isViewChanged = true;
                this._removeColumnFromXml(columnId);
            } else {
                var $td = $(columns[columnIndex]);
                SourceCode.Forms.Designers.Common.Context.removeControl($td);
                designer.steps[designer.LAYOUT_STEP_INDEX].setDefaultSelectedObject();
            }
        },
        _removeColumn: function(contextobject, designer) {
            if (!checkExists(contextobject) || contextobject.length === 0) {
                return;
            }
            var table = this._getParentTable(contextobject);
            var isForm = (designer === SourceCode.Forms.Designers.Form);
            var isCaptureList = (!isForm && designer.DesignerTable.ViewDesigner._getViewType() === "CaptureList");
            if (!isForm && isCaptureList && !table.hasClass("toolbar")) {
                function _doClearColumn() {
                    var tableBehahavior = SourceCode.Forms.Controls.Web.TableBehavior.prototype;
                    var row = contextobject.parent();
                    var rows = table.find('>tbody>tr');
                    if ((row.find('>td').length - 1) >= 1) {
                        var tableID = table.attr("id");
                        var jq_columnResizeWrapperDiv = jQuery("#" + tableID + "_columnResizeWrapperDiv");
                        var jq_Draggers = jq_columnResizeWrapperDiv.children();
                        var columnid = table.find("col").eq(index).attr("ID");
                        for (var i = 0; i < rows.length; i++) {
                            var thisRow = jQuery(rows[i]);
                            if (thisRow.hasClass("placeholder-footer"))
                                continue;
                            var cell = jQuery(thisRow.find('>td')[index]);
                            var prevCell = jQuery(thisRow.find('>td')[index - 1]);
                            var nextCell = jQuery(thisRow.find('>td')[index + 1]);
                            var cells = thisRow.find('>td');
                            if (cell.length > 0) {
                                var cellIndex = cell[0].cellIndex;
                                var cellWidth = cell.outerWidth();
                                tableBehahavior._cleanupChildren(designer, cell, true);
                                cell.remove();
                                if (i === 0) {
                                    var jq_groupCol = table.find(">.editor-body-colgroup col").eq(cellIndex);
                                    var jq_prevGroupCol = jq_groupCol.prev();
                                    var jq_nextGroupCol = jq_groupCol.next();
                                    if ((jq_nextGroupCol.length > 0) && (jq_prevGroupCol.length > 0)) {
                                        var groupColWidthHalfed = parseFloat(parseFloat(jq_groupCol[0].style.width) / 2).toFixed(2);
                                        var nextGroupColWidth = parseFloat(groupColWidthHalfed) + parseFloat(jq_nextGroupCol[0].style.width);
                                        var prevGroupColWidth = parseFloat(groupColWidthHalfed) + parseFloat(jq_prevGroupCol[0].style.width);
                                        jq_Draggers.eq(cellIndex).remove();
                                        jq_nextGroupCol[0].style.width = nextGroupColWidth + "%";
                                        jq_prevGroupCol[0].style.width = prevGroupColWidth + "%";
                                    } else if (jq_nextGroupCol.length > 0) {
                                        var nextColWidth = parseFloat(jq_nextGroupCol[0].style.width);
                                        var colWidth = parseFloat(jq_groupCol[0].style.width);
                                        var newWidth = nextColWidth + colWidth + "%";
                                        jq_nextGroupCol[0].style.width = newWidth;
                                        jq_Draggers.eq(cellIndex).remove();
                                    } else if (jq_prevGroupCol.length > 0) {
                                        var prevColWidth = parseFloat(jq_prevGroupCol[0].style.width);
                                        var colWidth = parseFloat(jq_groupCol[0].style.width);
                                        var newWidth = prevColWidth + colWidth + "%";
                                        jq_prevGroupCol[0].style.width = newWidth;
                                        jq_Draggers.eq(cellIndex - 1).remove();
                                    }
                                    jq_groupCol.remove();
                                }
                                cells = thisRow.find('>td');
                                tableBehahavior._SetRowCellLayout(thisRow);
                                if (i === (rows.length - 1)) {
                                    tableBehahavior._positionHandlers();
                                }
                            }
                        }
                        designer.ViewDesigner.isViewChanged = true;
                        tableBehahavior._removeColumnFromXml(columnid);
                        if (!table.hasClass("toolbar") && (designer.DesignerTable.View.SelectedViewType === 'CaptureList' && (SourceCode.Forms.Designers.View.selectedOptions.EnableListEditing || $chk(designer.DesignerTable.ViewDesigner._isEditableCaptureList())))) {
                            designer.DesignerTable._removeEditableColumn(index);
                            designer.DesignerTable._synchronizeEditableColumns();
                        }
                    }
                    designer.ViewDesigner._setDefaultSelectedObject();
                    designer.ViewDesigner._setupToolbar();
                }
                var itemsToHide = jQuery("div.drag-block,div.column-hover-overlay,div.column-selected-overlay").hide();
                if (!contextobject.is('td')) {
                    contextobject = this._getParentTD(contextobject);
                }
                jQuery(".column-selected-overlay").hide();
                jQuery("div.drag-block").hide();
                var index = contextobject[0].cellIndex;
                var _cells = this._getColumnCells(contextobject);
                var cellsData = [];
                var defXml = this._getDefinitonXML(designer);
                SourceCode.Forms.DependencyHelper._ensureDefinitionIsUpToDate(defXml);
                for (var i = 0, l = _cells.length; i < l; i++) {
                    if (checkExists(_cells[i])) {
                        var defXml = this._getDefinitonXML(designer);
                        var cellData = {
                            itemId: _cells[i][0].id,
                            itemType: SourceCode.Forms.DependencyHelper.ReferenceType.Cell
                        };
                        cellsData.push(cellData);
                        var controlsInCellDataArray = SourceCode.Forms.Designers.getControlDataCollectionForContainerControl(cellData);
                        if (controlsInCellDataArray.length > 0) {
                            cellsData = $.merge(cellsData, controlsInCellDataArray);
                        }
                    }
                }
                var columnDependencies = SourceCode.Forms.Designers.getDependencies(cellsData, {
                    skipDefinitionUpdate: true
                });
                if (columnDependencies.length > 0) {
                    var notifierOptions = {
                        references: columnDependencies,
                        deleteItemType: SourceCode.Forms.DependencyHelper.ReferenceType.Column,
                        removeObjFn: _doClearColumn
                    };
                    SourceCode.Forms.Designers.showDependencyNotifierPopup(notifierOptions);
                } else {
                    _doClearColumn();
                }
                designer.ViewDesigner._setDefaultSelectedObject();
                designer.ViewDesigner._setupToolbar();
                SourceCode.Forms.Designers.View.DesignerTable._positionHandlers();
            } else {
                this._removeItemViewColumn(table, contextobject, designer);
            }
        },
        _removeColumnFromXml: function(columnId) {
            var xmlDoc = SourceCode.Forms.Designers.View.viewDefinitionXML;
            var viewElem = SourceCode.Forms.Designers.View.ViewDesigner._getViewElem(xmlDoc);
            var colElement = viewElem.selectSingleNode("//Control[(@LayoutType='Grid')]/Columns/Column[@ID='{0}']".format(columnId));
            if (checkExists(colElement)) {
                colElement.parentNode.removeChild(colElement);
                var controlNode = xmlDoc.selectSingleNode("//Views/View/Controls/Control[@ID='{0}']".format(columnId));
                if (checkExists(controlNode)) {
                    controlNode.parentNode.removeChild(controlNode);
                }
            }
        },
        _getColumnCells: function(contextobject) {
            if (!checkExists(contextobject)) {
                return [];
            }
            if (contextobject.length > 0) {
                if (!contextobject.is('td')) {
                    contextobject = this._getParentTD(contextobject);
                }
                var table = this._getParentTable(contextobject);
                var index = contextobject[0].cellIndex;
                var rows = table.children("tbody").children("tr");
                var result = [];
                rows.each(function() {
                    var td = $(this).children("td").eq(index);
                    if (checkExists(td) && td.length > 0) {
                        result.push(td);
                    }
                });
                var editorTable = $(".capturelist-editor-table");
                if (checkExists(editorTable) && editorTable.length > 0) {
                    var editRow = editorTable.find("tr.editor-row");
                    if (checkExists(editRow)) {
                        var td = editRow.children("td").eq(index);
                        if (checkExists(td) && td.length > 0) {
                            result.push(td);
                        }
                    }
                }
                return $(result);
            }
        },
        _getRowCells: function(contextobject) {
            var result = [];
            if (checkExists(contextobject) && contextobject.length > 0 && contextobject.is('tr')) {
                result = contextobject.children("td");
            }
            return result;
        },
        _cleanupChildren: function(designer, object, removeParent) {
            var objectlist = [];
            if (removeParent) {
                objectlist.push(object);
            }
            objectlist.push(object.find(".controlwrapper"));
            objectlist.push(object.children("tr, td"));
            if (designer !== SourceCode.Forms.Designers.Form) {
                for (var i = 0; i < objectlist.length; i++) {
                    var item = objectlist[i];
                    SourceCode.Forms.Designers.View.ViewDesigner._removeControl(objectlist[i]);
                }
                if (jQuery('#vdViewEditorFormsTab').hasClass('selected')) {
                    SourceCode.Forms.Designers.View.ViewDesigner.View.isViewEventsLoading = true;
                    setTimeout($.proxy(function() {
                        SourceCode.Forms.Designers.View.ViewDesigner._LoadViewEvents();
                    }, SourceCode.Forms.Designers.View.ViewDesigner), 0);
                }
            } else {
                SourceCode.Forms.Designers.Common.Context.removeControl(object);
            }
        },
        _removeItemViewRow: function(table, selectedCell, designer) {
            var row = selectedCell.parent();
            var rows = table.find(">tbody>tr");
            var tableArray = this.designTableArrays[table.attr("id")];
            var cells = row.children("td");
            var cellOperations = SourceCode.Forms.Designers.removeRow(tableArray, selectedCell);
            var cellsToRemove = [];
            var clonedCells = [];
            for (var i = 0; i < cellOperations.length; i++) {
                var operation = cellOperations[i];
                var cell = null;
                if (operation.action === "reduceRow") {
                    cell = jQuery(rows[operation.row]).children("td:eq(" + operation.col + ")");
                    var newRowSpan = cell[0].rowSpan - 1;
                    if (newRowSpan > 1) {
                        cell[0].rowSpan = newRowSpan;
                    } else {
                        cell[0].rowSpan = 1;
                    }
                    if (operation.moveCell) {
                        clonedCells.push(cell);
                        var insertCell = jQuery(rows[operation.row + 1]).children("td:eq(" + operation.moveToCol + ")");
                        if (insertCell.length === 0) {
                            insertCell = jQuery(rows[operation.row + 1]).children("td:eq(" + (operation.moveToCol - 1) + ")");
                            insertCell.after(cell.clone());
                        } else {
                            insertCell.before(cell.clone());
                        }
                    }
                    cellsToRemove.push(cell);
                } else {
                    cell = row.find("td[id='{0}']".format(operation.id));
                    cellsToRemove.push(cell);
                }
            }
            for (var i = 0; i < clonedCells.length; i++) {
                $(clonedCells[i]).remove();
            }
            SourceCode.Forms.Controls.Web.TableBehavior.prototype._cleanupChildren(designer, row, true);
            row.remove();
            if (designer !== SourceCode.Forms.Designers.Form) {
                designer.ViewDesigner.isViewChanged = true;
                designer.ViewDesigner._setDefaultSelectedObject();
                designer.ViewDesigner._setupToolbar();
            }
            this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
        },
        _removeRow: function(contextobject, designer, dependenciesAlreadyChecked) {
            var index = 0;
            contextobject = jQuery(contextobject);
            if (!contextobject.is('td')) {
                contextobject = this._getParentTD(contextobject);
            }
            if (!(checkExists(contextobject)) || contextobject.length === 0) {
                return;
            }
            var table = this._getParentTable(contextobject);
            var row = contextobject.closest("tr");
            if (row.length > 0) {
                var _this = this;
                var _doRemoveRowFn = function() {
                    if (designer === SourceCode.Forms.Designers.Form || (table.hasClass("toolbar")) || designer.DesignerTable.ViewDesigner._getViewType() === "Capture") {
                        _this._removeItemViewRow(table, contextobject, designer);
                    } else {
                        if ((table.find('>tbody>tr').length - 1) >= 1) {
                            SourceCode.Forms.Controls.Web.TableBehavior.prototype._cleanupChildren(designer, row, true);
                            row.remove();
                            if (designer !== SourceCode.Forms.Designers.Form) {
                                designer.ViewDesigner.isViewChanged = true;
                            }
                            contextobject = null;
                        }
                    }
                };
                if (dependenciesAlreadyChecked) {
                    _doRemoveRowFn();
                    return;
                }
                var cells = this._getRowCells(row);
                var cellsData = [];
                var defXml = this._getDefinitonXML(designer);
                SourceCode.Forms.DependencyHelper._ensureDefinitionIsUpToDate(defXml);
                for (var c = 0; c < cells.length; c++) {
                    var cell = cells[c];
                    var cellData = {
                        itemId: cell.id,
                        itemType: SourceCode.Forms.DependencyHelper.ReferenceType.Cell
                    };
                    cellsData.push(cellData);
                    var controlsInCellDataArray = SourceCode.Forms.Designers.getControlDataCollectionForContainerControl(cellData);
                    if (controlsInCellDataArray.length > 0) {
                        cellsData = $.merge(cellsData, controlsInCellDataArray);
                    }
                }
                var rowDependencies = SourceCode.Forms.Designers.getDependencies(cellsData, {
                    skipDefinitionUpdate: true
                });
                if (rowDependencies.length > 0) {
                    var notifierOptions = {
                        references: rowDependencies,
                        deleteItemType: SourceCode.Forms.DependencyHelper.ReferenceType.Row,
                        removeObjFn: _doRemoveRowFn
                    };
                    SourceCode.Forms.Designers.showDependencyNotifierPopup(notifierOptions);
                } else {
                    _doRemoveRowFn();
                }
            }
            if (designer !== SourceCode.Forms.Designers.Form) {
                designer.ViewDesigner._setupToolbar();
                designer.ViewDesigner._setDefaultSelectedObject();
            } else {
                designer.steps[designer.LAYOUT_STEP_INDEX].setDefaultSelectedObject();
            }
            this.designTableArrays[table.attr("id")] = SourceCode.Forms.Designers.generateTableArray(table);
        },
        _setAlignment: function(alignment, passedContextObject, designer) {
            var contextobject = passedContextObject;
            if (!checkExists(contextobject)) {
                contextobject = SourceCode.Forms.Designers.View.DesignerTable.View.selectedObject;
            }
            if (!checkExists(contextobject) || contextobject.length === 0) {
                return;
            }
            var isInEditTemplate = contextobject.closest("table.capturelist-editor-table").length > 0;
            var isInToolbarTable = contextobject.closest("table.editor-table.toolbar").length > 0;
            var contextIsInFooter = contextobject.closest("tr").is(".footer");
            var isCaptureList = designer !== SourceCode.Forms.Designers.Form ? designer.DesignerTable.ViewDesigner._getViewType() === "CaptureList" : false;
            if (isCaptureList && !contextIsInFooter && !isInEditTemplate && !isInToolbarTable) {
                var cellIndex = contextobject[0].cellIndex;
                SourceCode.Forms.Designers.View.DesignerTable._removeHeaderAlignmentStyle("Text/Align", cellIndex);
                var colGroupItem = contextobject.closest("table").find(">colgroup>col:nth-child({0})".format(cellIndex + 1));
                var type = "Column";
                var defaultStyle = SCStyleHelper.getPrimaryStyleNode(SourceCode.Forms.Designers.View.DesignerTable.Styles._getStylesNode(colGroupItem.attr("id"), type));
                SourceCode.Forms.Designers.View.DesignerTable.Styles._setTextAlignment(defaultStyle, alignment);
                SourceCode.Forms.Designers.View.DesignerTable.Styles.populateColumnControlStyle(cellIndex, defaultStyle);
            } else {
                var id = contextobject.attr("id");
                var type = contextobject.attr("controltype") !== undefined ? contextobject.attr("controltype") : "Cell";
                if (checkExists(id)) {
                    SourceCode.Forms.Designers.Common.Context.setControlTextAlignment(id, type, alignment, contextobject);
                }
            }
        },
        _getSection: function(currentItem) {
            return jQuery(currentItem).parents('.section');
        },
        _setVerticalAlignment: function(alignment, passedContextObject, designer) {
            var contextobject = passedContextObject;
            if (!checkExists(contextobject)) {
                contextobject = SourceCode.Forms.Designers.View.DesignerTable.View.selectedObject;
            }
            if (!checkExists(contextobject) || contextobject.length === 0) {
                return;
            }
            var isInEditTemplate = contextobject.closest("table.capturelist-editor-table").length > 0;
            var isInToolbarTable = contextobject.closest("table.editor-table.toolbar").length > 0;
            var contextIsInFooter = contextobject.closest("tr").is(".footer");
            var isCaptureList = designer !== SourceCode.Forms.Designers.Form ? designer.DesignerTable.ViewDesigner._getViewType() === "CaptureList" : false;
            if (isCaptureList && !contextIsInFooter && !isInEditTemplate && !isInToolbarTable) {
                var cellIndex = contextobject[0].cellIndex;
                SourceCode.Forms.Designers.View.DesignerTable._removeHeaderAlignmentStyle("VerticalAlign", cellIndex);
                var colGroupItem = contextobject.closest("table").find(">colgroup>col:nth-child({0})".format(cellIndex + 1));
                var type = contextobject.attr("controltype") !== undefined ? contextobject.attr("controltype") : "Column";
                var defaultStyle = SCStyleHelper.getPrimaryStyleNode(SourceCode.Forms.Designers.View.DesignerTable.Styles._getStylesNode(colGroupItem.attr("id"), type));
                SourceCode.Forms.Designers.View.DesignerTable.Styles._setVerticalAlignment(defaultStyle, alignment);
                SourceCode.Forms.Designers.View.DesignerTable.Styles.populateColumnControlStyle(cellIndex, style);
            } else {
                var id = contextobject.attr("id");
                if (checkExists(id)) {
                    var type = contextobject.attr("controltype") !== undefined ? contextobject.attr("controltype") : "Cell";
                    var defaultStyle = SCStyleHelper.getPrimaryStyleNode(SourceCode.Forms.Designers.View.DesignerTable.Styles._getStylesNode(id, type));
                    SourceCode.Forms.Designers.View.DesignerTable.Styles._setVerticalAlignment(defaultStyle, alignment);
                    SourceCode.Forms.Designers.View.DesignerTable.Styles._applyControlStyles(contextobject, defaultStyle);
                }
            }
        },
        _makeColumnDraggable: function(dragHandler, designer) {
            SourceCode.Forms.Designers.View.DesignerTable._makeColumnDraggable(dragHandler);
        },
        _positionHandlers: function() {
            SourceCode.Forms.Designers.View.DesignerTable._positionHandlers();
        },
        _checkIfControlRequiresResize: function(tableRows, columnIndex, newColWidthPixels, newNextColWidthPixels) {
            for (var t = 0; t < tableRows.length; t++) {
                var jq_row = tableRows.eq(t);
                var rowCols = jq_row.find(">td");
                var jq_column = null;
                var totalRowColumnSpan = 0;
                for (var r = 0; r < rowCols.length; r++) {
                    var currentRowColumn = rowCols.eq(r);
                    var currentRowColumnSpan = currentRowColumn.attr("colspan");
                    var currentRowColumnIndex = currentRowColumn.index();
                    if (currentRowColumnSpan > 1) {
                        totalRowColumnSpan += currentRowColumnSpan;
                        if (totalRowColumnSpan === (columnIndex + 1)) {
                            jq_column = currentRowColumn;
                            break;
                        }
                    } else {
                        totalRowColumnSpan++;
                    }
                }
                if (!checkExists(jq_column)) {
                    jq_column = jq_row.find(">td").eq(columnIndex);
                }
                var tdChildControls = jq_column.find('.controlwrapper');
                for (var c = 0; c < tdChildControls.length; c++) {
                    var jq_childControl = jQuery(tdChildControls[c]);
                    this._doControlResizing(jq_childControl, newColWidthPixels);
                }
                var jq_nextColumn = jq_column.next();
                var nextColumnControls = jq_nextColumn.find(".controlwrapper");
                for (var c = 0; c < nextColumnControls.length; c++) {
                    var jq_nextColumnControl = nextColumnControls.eq(c);
                    this._doControlResizing(jq_nextColumnControl, newNextColWidthPixels);
                }
            }
        },
        _setOptions: function(objInfo) {
            var bool = objInfo.Value.toString().toLowerCase() === 'true';
            switch (objInfo.property.toLowerCase()) {
            case "isvisible":
                this.setIsVisible(bool);
                break;
            case "isenabled":
                this.setIsEnabled(bool);
                break;
            case "isparentenabled":
                this.setIsParentEnabled(bool);
                break;
            case "isparentreadonly":
                this.setIsParentReadOnly(bool);
                break;
            case "isparentvisible":
                this.setIsParentVisible(bool);
                break;
            case "isreadonly":
                this.setIsReadOnly(bool);
                break;
            case "width":
                this.setWidth(objInfo.Value);
                break;
            case "styles":
            case "style":
                this.style(objInfo.Value);
                break;
            default:
                break;
            }
        },
        setWidth: function(value) {
            if (value === '' || value.toLowerCase() === 'auto') {
                $('#' + this._id + "_Table")[0].style.width = 'auto';
                this._width = value;
            } else {
                var unit = value.indexOf('%') === -1 ? 'px' : '%';
                value = value.toLowerCase().replaceAll('px', '').replaceAll('%', '');
                value = isNaN(parseInt(value)) ? parseFloat(value) : parseInt(value);
                if (!isNaN(value)) {
                    $('#' + this._id + "_Table")[0].style.width = value + unit;
                    this._width = value + unit;
                }
            }
        },
        _getOptions: function(objInfo) {
            if (checkExists(objInfo)) {
                var context = $find(objInfo.CurrentControlId);
                switch (objInfo.property.toLowerCase()) {
                case "isvisible":
                    return context.get_isVisible();
                    break;
                case "isparentvisible":
                    return context.get_isParentVisible();
                    break;
                case "isenabled":
                    return context.get_isEnabled();
                    break;
                case "isparentenabled":
                    return context.get_isParentEnabled();
                    break;
                case "isparentreadonly":
                    return context.get_isParentReadOnly();
                    break;
                case "isreadonly":
                    return context.get_isReadOnly();
                    break;
                case "width":
                    return context.get_width();
                    break;
                case "style":
                    return context.style();
                    break;
                default:
                    return undefined;
                    break;
                }
            }
        },
        _doControlResizing: function(jq_childControl, columnNewWidth) {
            var controlMinWidth = parseInt(jq_childControl.css('min-width'));
            var controlType = jq_childControl.attr("controltype");
            var controlDefaultWidth = SourceCode.Forms.Designers.View.ViewDesigner._getControlDefaultProperty(controlType, 'Width');
            var controlCurrentWidth = SourceCode.Forms.Designers.View.ViewDesigner._getControlPropertyValue(jq_childControl.attr('id'), 'Width');
            var controlXML = SourceCode.Forms.Designers.View.ViewDesigner._getControlPropertiesXML(jq_childControl.attr('id'));
            if ($chk(controlCurrentWidth)) {
                var setFunction = SourceCode.Forms.Designers.View.ViewDesigner._getPropertySetFunction(jq_childControl.attr('controltype'), 'Width');
                if (controlCurrentWidth.indexOf("%") >= 0) {
                    if (checkExistsNotEmpty(setFunction)) {
                        var value = evalFunction(setFunction)(jq_childControl, controlCurrentWidth, controlXML);
                    }
                } else {
                    if (parseInt(controlCurrentWidth) > columnNewWidth) {
                        if (checkExistsNotEmpty(setFunction)) {
                            var value = evalFunction(setFunction)(jq_childControl, "100%", controlXML);
                            SourceCode.Forms.Designers.View.ViewDesigner._setControlPropertyValue(jq_childControl.attr("id"), "Width", "100%");
                        } else {
                            SourceCode.Forms.Designers.View.ViewDesigner._resetDesignWidthControl(jq_childControl, jq_childControl.find(".resizewrapper"));
                        }
                    }
                }
            }
        },
        _addColumnGroupColumns: function(table, designer) {
            var tableID = table.attr("id");
            var jq_columnResizeWrapperDiv = (designer.DesignerTable !== undefined ? table.siblings("#" + tableID + "_columnResizeWrapperDiv") : $("#" + tableID).find("#" + tableID + "_columnResizeWrapperDiv"));
            var jq_ColGroup = table.find(" > colgroup");
            var columns = table.find(">tbody>tr:eq(0)>td");
            if (jq_columnResizeWrapperDiv.length === 0) {
                jq_columnResizeWrapperDiv = jQuery("<div>");
                jq_columnResizeWrapperDiv.attr("id", tableID + "_columnResizeWrapperDiv");
                jq_columnResizeWrapperDiv.addClass("columnWrapperDiv");
                if (checkExists(designer.DesignerTable)) {
                    table.closest('.controlwrapper').append(jq_columnResizeWrapperDiv);
                } else {
                    $("#" + tableID).append(jq_columnResizeWrapperDiv);
                }
            }
            if (jq_ColGroup.length === 0) {
                jq_ColGroup = jQuery("<colgroup />");
                jq_ColGroup.insertBefore(table.find("tbody"));
            }
            jq_ColGroup.addClass("editor-body-colgroup");
            var tableWidth = table.width();
            table.data("width", tableWidth);
            jq_columnResizeWrapperDiv.children().remove();
            var colsWidthPixels = new Number((tableWidth / columns.length));
            var colWidth = "{0}%".format((colsWidthPixels / tableWidth * 100).toFixed(2));
            for (var c = 0; c < columns.length; c++) {
                var jq_Column = columns.eq(c);
                $(jq_ColGroup).children()[c].style.width = colWidth;
                if (c !== columns.length - 1) {
                    var jq_dragDiv = jQuery("<div id='" + String.generateGuid() + "' class='drag-column'><div class='drag-block'></div></div>");
                    jq_dragDiv.data("tableID", tableID);
                    jq_columnResizeWrapperDiv.append(jq_dragDiv);
                    this._makeColumnDraggable(jq_dragDiv, designer);
                }
                if (designer.DesignerTable !== undefined && designer.DesignerTable.ViewDesigner._getViewType() !== "Capture") {
                    var xmlDoc = designer.ViewDesigner.View.viewDefinitionXML;
                    var containerId = table.closest("div.controlwrapper").attr("ID");
                    var columns = designer.definitionXml.selectSingleNode("//Control[@ID='" + tableID + "']/Columns");
                    designer.ViewDesigner._BuildColumnXML(xmlDoc, containerId, $("<col />"), null)
                }
            }
            table.find(">tbody>tr>td").width("");
            SourceCode.Forms.Controls.Web.TableBehavior.prototype._positionHandlers();
        },
        _BuildColumnXML: function(xmlDoc, containerID, jq_Col, columnsElem, designer) {
            if (!checkExists(columnsElem)) {
                var gridControlElement = xmlDoc.selectSingleNode("//Control[(@LayoutType='Grid')and(@ID='" + containerID + "')]");
                if (designer !== SourceCode.Forms.Designers.Form && $chk(gridControlElement) === false) {
                    designer.ViewDesigner._BuildViewXML();
                    xmlDoc = designer.ViewDesigner.View.viewDefinitionXML;
                    gridControlElement = xmlDoc.selectSingleNode("//Control[(@LayoutType='Grid')and(@ID='" + containerID + "')]");
                } else if (!checkExists(gridControlElement)) {
                    SourceCode.Forms.Designers.Common.checkLayoutXML();
                    xmlDoc = SourceCode.Forms.Designers.Form.definitionXml;
                    gridControlElement = xmlDoc.selectNodes("//Control[(@LayoutType='Grid')and(@ID='" + containerID + "')]");
                }
                var columnsElem = gridControlElement.selectSingleNode("Columns");
                if (!checkExists(columnsElem)) {
                    columnsElem = xmlDoc.createElement('Columns');
                    gridControlElement.appendChild(columnsElem);
                }
            }
            var colWidth = parseFloat(jq_Col[0].style.width);
            if (checkExists(colWidth) && colWidth > 0) {
                var id = jq_Col.attr("id");
                var colElement = columnsElem.selectSingleNode("Column[@ID='{0}']".format(id));
                if (!checkExists(colElement)) {
                    colElement = xmlDoc.createElement("Column");
                    var nextCol = jq_Col.next();
                    if (nextCol.length > 0) {
                        var nextColID = nextCol.attr('id');
                        var nextColElement = xmlDoc.selectSingleNode("//Column[@ID='" + nextColID + "']");
                        if (nextColElement !== null) {
                            columnsElem.insertBefore(colElement, nextColElement)
                        } else {
                            columnsElem.appendChild(colElement);
                        }
                    } else {
                        columnsElem.appendChild(colElement);
                    }
                }
                var percentageWidth = colWidth + "%";
                colElement.setAttribute("ID", id);
                colElement.setAttribute("Size", percentageWidth);
                if (designer !== SourceCode.Forms.Designers.Form) {
                    var controlXml;
                    _viewDesigner._createControl(xmlDoc, {
                        id: id,
                        controltype: "Column"
                    });
                    controlXml = xmlDoc.selectSingleNode("//Views/View/Controls/Control[@ID='{0}']".format(id));
                    var properties = controlXml.selectSingleNode("Properties");
                    if (!checkExists(properties)) {
                        properties = xmlDoc.createElement("Properties");
                        properties.appendChild(_viewDesigner._createEventingPropertyWithEncoding(xmlDoc, "Size", percentageWidth));
                        controlXml.appendChild(properties);
                    } else {
                        var sizeProperty = properties.selectSingleNode("Property[Name='Size']/Value");
                        if (checkExists(sizeProperty) && checkExists(sizeProperty.firstChild)) {
                            sizeProperty.removeChild(sizeProperty.firstChild);
                            sizeProperty.appendChild(xmlDoc.createTextNode(percentageWidth));
                        }
                    }
                }
            }
        },
        _getDefinitonXML: function(designer) {
            var defXml = null;
            if (designer === SourceCode.Forms.Designers.Form) {
                defXml = designer.definitionXml;
            } else {
                defXml = designer.viewDefinitionXML;
            }
            return defXml;
        }
    });
    if (SourceCode.Forms.Controls.Web.TableBehavior.registerClass) {
        SourceCode.Forms.Controls.Web.TableBehavior.registerClass('SourceCode.Forms.Controls.Web.TableBehavior', SourceCode.Forms.Controls.Web.BehaviorBase);
    }
    $.fn.cellPos = function(rescan) {
        var $cell = this.first()
          , pos = $cell.data("cellPos");
        if (!pos || rescan) {
            var $table = $cell.closest("table, thead, tbody, tfoot");
            SourceCode.Forms.Controls.Web.TableBehavior.prototype.scanTable($table);
        }
        pos = $cell.data("cellPos");
        return pos;
    }
}(jQuery));
