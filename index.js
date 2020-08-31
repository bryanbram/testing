var SourceCode=SourceCode||{};SourceCode.Forms=SourceCode.Forms||{};SourceCode.Forms.Xml=SourceCode.Forms.Xml||{}
var createXML=function()
{var doc;if(!supportsActiveX())
{doc=document.implementation.createDocument(null,null,null);}
else
{doc=new ActiveXObject("Msxml2.DOMDocument.6.0");doc.async=false;doc.preserveWhiteSpace=true;}
return doc;};var parseXML=function(xml)
{if(typeof xml==="undefined"||xml==null||xml==="")
{debugger;}
return jQuery.parseXML(xml);};var tryParseXML=function(xml)
{var doc=null;try
{if(typeof xml==="string"&&xml.toString().trim().indexOf("<")!=0)
{doc=jQuery.parseXML("<Dummy/>");doc.removeChild(doc.documentElement);}
else
{doc=jQuery.parseXML(xml);}}
catch(e)
{doc=jQuery.parseXML("<Dummy/>");doc.removeChild(doc.documentElement);}
return doc;};var xmlRegularExpressions={slashes:/\\\\/g};if(window.XMLSerializer&&window.Node&&Node.prototype&&Node.prototype.__defineGetter__)
{var _xmlDocumentPrototype={transformNode:function(x)
{return(this.transformXML(x)).xml;},transformXML:function(xslt)
{var p=new XSLTProcessor();p.importStylesheet(xslt);return p.transformToDocument(this);},_detectEdgeCrash:function()
{if(SourceCode.Forms.Browser.edge===true&&!this.documentElement&&!this.parentNode&&this.childNodes.length===0)
{return true;}},selectSingleNode:function(xpath)
{var doc=this;if(doc.nodeType!==9)
{doc=doc.ownerDocument;}
if(typeof(doc.nsResolver)==='undefined'||doc.nsResolver===null)
{doc.nsResolver=function(prefix){return(null);};}
if(_xmlDocumentPrototype._detectEdgeCrash.call(this))
{return null;}
var node=doc.evaluate(xpath.replace(xmlRegularExpressions.slashes,"\\"),this,doc.nsResolver,XPathResult.ANY_UNORDERED_NODE_TYPE,null);if(node!==null&&typeof(node.singleNodeValue)!=='undefined'&&node.singleNodeValue!==null)
{return node.singleNodeValue;}
return null;},selectNodes:function(xpath)
{var doc=this;if(doc.nodeType!==9)
{doc=doc.ownerDocument;}
if(doc.nsResolver===null)
{doc.nsResolver=function(prefix){return(null);};}
if(_xmlDocumentPrototype._detectEdgeCrash.call(this))
{return[];}
var result=doc.evaluate(xpath,this,doc.nsResolver,XPathResult.ANY_TYPE,null);var nodes=[],i;while(i=result.iterateNext())
{nodes.push(i);}
return(nodes);}};if(!XMLDocument.prototype.evaluate&&!supportsActiveX())
{XMLDocument.prototype.evaluate=function(xpath,xml,resolver,xPathResult,res)
{return document.evaluate(xpath,xml,resolver,xPathResult,res);};}
jQuery.extend(XMLDocument.prototype,_xmlDocumentPrototype);Node.prototype.selectSingleNode=XMLDocument.prototype.selectSingleNode;Node.prototype.selectNodes=XMLDocument.prototype.selectNodes;XMLDocument.prototype.__defineGetter__("xml",function()
{return(new XMLSerializer()).serializeToString(this);});Node.prototype.__defineGetter__("xml",function()
{return(new XMLSerializer()).serializeToString(this);});Node.prototype.__defineGetter__("text",function()
{var text="";if(this.childNodes.length>0)
{for(var i=0;i<this.childNodes.length;i++)
{if(this.childNodes[i].hasChildNodes())
{text+=this.childNodes[i].text;}else
{text+=(this.childNodes[i].nodeValue!==null)?this.childNodes[i].nodeValue:"";}}}
else if(checkExists(this.nodeValue))
{text=this.nodeValue;}
return text;});if(typeof(Attr)!=="undefined")
{Attr.prototype.__defineGetter__("text",function()
{return this.value;});}}
function XslTransform(object)
{this.init(object);}
var _xslTransformPrototype={options:{stylesheet:"",parameters:[]},init:function(options)
{this.options=jQuery.extend({},this.options,options);this.processor=null;if($defined(this.options.stylesheet)&&this.options.stylesheet!="")
{this.importStylesheet(this.options.stylesheet);}
if(this.options.parameters.length&&this.options.parameters.length>0)
{this.options.parameters.each(function(value,key)
{this.addParameter(key,value);});}},_stylesheets:{},importStylesheet:function(xsltFile)
{var xslDoc;var useActiveX=false;if(checkExistsNotEmpty(xsltFile)&&xsltFile.indexOf("?")===-1&&checkExists(SourceCode.Forms.Settings)&&checkExistsNotEmpty(SourceCode.Forms.Settings.Version))
{xsltFile=xsltFile+"?_v="+encodeURIComponent(SourceCode.Forms.Settings.Version);}
if(typeof this._stylesheets[xsltFile]!=="undefined")
{xslDoc=this._stylesheets[xsltFile];if(typeof XSLTProcessor==="undefined")
{useActiveX=true;}}
else
{if(typeof XSLTProcessor!=="undefined")
{try
{xslDoc=document.implementation.createDocument("","",null);xslDoc.async=false;xslDoc.load(xsltFile);}
catch(e)
{try
{var xmlhttp=new window.XMLHttpRequest();xmlhttp.open("GET",xsltFile,false);xmlhttp.send(null);if(checkExists(xmlhttp.responseXML)&&checkExists(xmlhttp.responseXML.documentElement))
{xslDoc=xmlhttp.responseXML.documentElement;}
else if(checkExistsNotEmpty(xmlhttp.responseText))
{xslDoc=parseXML(xmlhttp.responseText);}}
catch(x)
{}}}
else
{useActiveX=true;xslDoc=new ActiveXObject("Msxml2.FreeThreadedDOMDocument.6.0");xslDoc.async=false;xslDoc.load(xsltFile);}}
if(useActiveX===false)
{if(this.processor===null)
{this.processor=new XSLTProcessor();}
this.processor.importStylesheet(xslDoc);}
else
{var xslt=new ActiveXObject("Msxml2.XSLTemplate.6.0");xslt.stylesheet=xslDoc;this.processor=xslt.createProcessor();}
this._stylesheets[xsltFile]=xslDoc;return this;},addParameter:function(key,value)
{if(this.processor!==null)
{if(this.processor.setParameter)
{this.processor.setParameter("",key,value);}
else
{this.processor.addParameter(key,value);}}},transform:function(xmlDom,xsltDoc,resultType)
{var domDoc;if($defined(xmlDom.documentElement))
{domDoc=xmlDom;}
else if(jQuery.type(xmlDom)==='string')
{domDoc=parseXML(xmlDom);}
if(checkExists(xsltDoc))
{this.importStylesheet(xsltDoc);}
if(typeof XSLTProcessor!=="undefined")
{var resultDom=this.processor.transformToDocument(domDoc);if(resultType==='text')
{if(resultDom===null)
{resultDom="";}
else
{resultDom=resultDom.xml;}}
return resultDom;}
else
{this.processor.input=domDoc;try
{this.processor.transform();}
catch(ex)
{}
if(resultType==='text')
{return this.processor.output;}
else
{var doc=parseXML(this.processor.output);return doc;}}},transformToText:function(xmlDom,xsltDoc)
{return this.transform(xmlDom,xsltDoc,'text');},transformToDocument:function(xmlDom,xsltDoc)
{return this.transform(xmlDom,xsltDoc,'document');}};jQuery.extend(XslTransform.prototype,_xslTransformPrototype);function cloneNodes(nodeToAppendTo,nodeToSelectFrom,xpath,executeForward)
{if(nodeToSelectFrom!==null&&nodeToAppendTo!==null&&xpath!==null&&xpath!==""&&typeof nodeToSelectFrom.selectNodes!=="undefined"&&typeof nodeToAppendTo.appendChild!=="undefined")
{var nodes=nodeToSelectFrom.selectNodes(xpath);if(!checkExists(executeForward)||executeForward===false)
{for(var m=nodes.length-1;m>=0;m--)
{nodeToAppendTo.appendChild(nodes[m].cloneNode(true));}}else
{for(var m=0;m<nodes.length;m++)
{nodeToAppendTo.appendChild(nodes[m].cloneNode(true));}}}}
function cloneItemTypeNodes(nodeToAppendTo,nodeToSelectFrom,itemType,executeForward)
{cloneNodes(nodeToAppendTo,nodeToSelectFrom,"/Items/Item[@ItemType='{0}']".format(itemType),executeForward);}
function removeXmlNodes(nodeOrXml,xpath,recurse)
{var xml=nodeOrXml;if(typeof nodeOrXml===typeof"")
{if(nodeOrXml==="")
{return"";}
xml=parseXML(nodeOrXml);}
var nodes=xml.selectNodes(xpath);while(nodes.length>0)
{for(var k=nodes.length-1;k>=0;k--)
{nodes[k].parentNode.removeChild(nodes[k]);}
if(recurse)
{nodes=xml.selectNodes(xpath);}
else
{nodes=[];}}
nodeOrXml=xml;}
function removeXmlNodesParentNode(nodeOrXml,xpath)
{var xml=nodeOrXml;if(typeof nodeOrXml===typeof"")
{if(nodeOrXml==="")
{return"";}
xml=parseXML(nodeOrXml);}
var nodes=xml.selectNodes(xpath);for(var k=nodes.length-1;k>=0;k--)
{nodes[k].parentNode.parentNode.removeChild(nodes[k].parentNode);}
nodeOrXml=xml;}
function removeXmlNodesString(nodeOrXml,xpath)
{removeXmlNodes(nodeOrXml,xpath);if(typeof nodeOrXml!==typeof""&&typeof nodeOrXml.xml!=="undefined")
{return nodeOrXml.xml;}
return nodeOrXml;}
var $xml=function(xml)
{var xmlDoc=parseXML(xml);xmlDoc.preserveWhiteSpace=true;return xmlDoc;};var $sn=function(xmldoc,xpath)
{return xmldoc.selectSingleNode(xpath);};var $mn=function(xmldoc,xpath)
{return xmldoc.selectNodes(xpath);};function _getCurrentNodeXpath(o)
{var orginalNode=o.originalFromNode;var currentNode=o.fromNode;var currentXpath=o.currentXpath;if(typeof currentNode.tagName==="undefined")
{return currentXpath;}
var newXpath=currentNode.tagName;if(currentXpath!=="")
{newXpath=currentXpath+"/"+newXpath;}
else
{if(o.orginalToNodeIsChild)
{o.orginalToNodeIsChild=false;return"";}}
var checkNodes=$mn(orginalNode,newXpath);var attributesAdded=0;var nodesAdded=0;var attributeCount=currentNode.attributes.length;var nodeCount=currentNode.childNodes.length;var tempXpath=newXpath;var emptyAttributeCheck=(attributeCount===0)?"mustAdd":"na";var emptyNodeCheck=(nodeCount===0)?"mustAdd":"na";var itemAdded=false;o.isIdentifyingPath=false;if(checkExists(o.identifyingPath))
{var newPathSplit=newXpath.split("/");var newPathCount=newPathSplit.length;var identifyingPathSplit=o.identifyingPath.split("/");var identifyingPathCount=identifyingPathSplit.length;var areEqual=true;for(var i=1;i<=identifyingPathCount&&areEqual;i++)
{areEqual=newPathSplit[newPathCount-i].split("[")[0]===identifyingPathSplit[identifyingPathCount-i];}
o.isIdentifyingPath=areEqual;if(o.isIdentifyingPath)
{if(checkExists(o.identifyingAttributes))
{for(var i=0;i<o.identifyingAttributes.length&&checkNodes.length>1;i++)
{var attributeName=o.identifyingAttributes[i];var currentNodeAttribute=currentNode.getAttribute(attributeName);if(checkExists(currentNodeAttribute))
{if(itemAdded)
{tempXpath="{0} and @{1}='{2}']".format(tempXpath.substr(0,tempXpath.length-1),attributeName,currentNodeAttribute);}
else
{tempXpath="{0}[@{1}='{2}']".format(tempXpath,attributeName,currentNodeAttribute);}}
else
{if(itemAdded)
{tempXpath="{0} and not(@{1})]".format(tempXpath.substr(0,tempXpath.length-1),attributeName);}
else
{tempXpath="{0}[not(@{1})]".format(tempXpath,attributeName);}}
itemAdded=true;checkNodes=$mn(orginalNode,tempXpath);}}
if(checkExists(o.identifyingNodes))
{for(var i=0;i<o.identifyingNodes.length&&checkNodes.length>1;i++)
{var nodeName=o.identifyingNodes[i];var currentNodeNode=currentNode.selectSingleNode(nodeName);if(checkExists(currentNodeNode))
{if(itemAdded)
{tempXpath="{0} and {1}='{2}']".format(tempXpath.substr(0,tempXpath.length-1),nodeName,currentNodeNode.text);}
else
{tempXpath="{0}[{1}='{2}'".format(tempXpath,nodeName,currentNodeNode.text);}}
else
{if(itemAdded)
{tempXpath="{0} and not({1})]".format(tempXpath.substr(0,tempXpath.length-1),nodeName);}
else
{tempXpath="{0}[not({1})]".format(tempXpath,nodeName);}}
itemAdded=true;checkNodes=$mn(orginalNode,tempXpath);}}}}
while(checkNodes.length>1&&(attributesAdded!==attributeCount||nodesAdded!==nodeCount||emptyNodeCheck==="mustAdd"||emptyAttributeCheck==="mustAdd"))
{if(attributesAdded<attributeCount)
{var attribute=currentNode.attributes[attributesAdded];if(!o.isIdentifyingPath||!checkExists(o.identifyingAttributes)||!o.identifyingAttributes.contains(attribute.name))
{if(itemAdded)
{tempXpath="{0} and @{1}='{2}']".format(tempXpath.substr(0,tempXpath.length-1),attribute.name,attribute.value);}
else
{tempXpath="{0}[@{1}='{2}']".format(tempXpath,attribute.name,attribute.value);}
itemAdded=true;}
attributesAdded++;}
else if(emptyAttributeCheck==="mustAdd")
{if(itemAdded)
{tempXpath="{0} and not(@*)]".format(tempXpath.substr(0,tempXpath.length-1));}
else
{tempXpath="{0}[not(@*)]".format(tempXpath);}
emptyAttributeCheck="added";itemAdded=true;}
else
{if(nodesAdded<nodeCount)
{var node=currentNode.childNodes[nodesAdded];if(!o.isIdentifyingPath||!checkExists(o.identifyingNodes)||!o.identifyingNodes.contains(node.tagName))
{if(itemAdded)
{tempXpath=tempXpath.substr(0,tempXpath.length-1)+" and "+node.tagName+"]";}
else
{tempXpath=tempXpath+"["+node.tagName+"]";}
itemAdded=true;}
nodesAdded++;}
else if(emptyNodeCheck==="mustAdd")
{if(itemAdded)
{tempXpath="{0} and not(*)]".format(tempXpath.substr(0,tempXpath.length-1));}
else
{tempXpath="{0}[not(*)]".format(tempXpath);}
emptyNodeCheck="added";itemAdded=true;}}
checkNodes=$mn(orginalNode,tempXpath);}
if(checkNodes.length>1)
{tempXpath=newXpath;}
return tempXpath;}
function MergeXmlNodes(options)
{if(!checkExists(options.overideValue==="undefined"))
{options.overideValue=false;}
if(!checkExists(options.compareOnly))
{options.compareOnly=false;}
if(!checkExists(options.fromNode))
{return null;}
options.changesMade=0;options.currentXpath="";options.orginalToNodeIsChild=false;if(!options.toNode.parentNode&&options.toNode.documentElement)
{options.originalToNode=options.toNode;options.toNode=options.toNode.documentElement;}
else if(options.toNode.parentNode)
{options.originalToNode=options.toNode.parentNode;}
else
{options.orginalToNodeIsChild=true;options.originalToNode=options.toNode;}
if(!options.fromNode.parentNode&&options.fromNode.documentElement)
{options.originalFromNode=options.fromNode;options.fromNode=options.fromNode.documentElement;}
else if(options.fromNode.parentNode)
{options.originalFromNode=options.fromNode.parentNode;}
else
{options.originalFromNode=options.fromNode;}
return MergeXmlNodesInternal(options);}
function MergeXmlNodesInternal(o)
{var newXpath=_getCurrentNodeXpath(o);if(o.fromNode.hasChildNodes())
{for(var s=0;s<o.fromNode.childNodes.length;s++)
{var currentFromNode=o.fromNode.childNodes[s];var options={fromNode:o.fromNode.childNodes[s],toNode:o.toNode,overideValue:o.overideValue,compareOnly:o.compareOnly,changesMade:o.changesMade,originalToNode:o.originalToNode,originalFromNode:o.originalFromNode,orginalToNodeIsChild:o.orginalToNodeIsChild,identifyingPath:o.identifyingPath,identifyingAttributes:o.identifyingAttributes,identifyingNodes:o.identifyingNodes,currentXpath:newXpath};o.changesMade=MergeXmlNodesInternal(options);if(o.compareOnly&&o.changesMade>0)
{return o.changesMade;}}
if(typeof o.fromNode.attributes!=="undefined"&&o.fromNode.attributes!==null)
{var saCount=o.fromNode.attributes.length;for(var c=0;c<saCount;c++)
{var sa=o.fromNode.attributes[c];var thisNode=$sn(o.originalToNode,newXpath);var currentvalue=thisNode.getAttribute(sa.name);if(currentvalue!==sa.value)
{if(!o.compareOnly&&(currentvalue===null||o.overideValue))
{thisNode.setAttribute(sa.name,sa.value);}
o.changesMade++;if(o.compareOnly)
{return o.changesMade;}}}}}
else
{var isTextnode=(typeof o.fromNode.tagName==="undefined");var matchingNode=$sn(o.originalToNode,newXpath);if(typeof(matchingNode)!=='undefined'&&matchingNode!==null)
{if(isTextnode)
{var textNode=null;for(var s=0;s<matchingNode.childNodes.length;s++)
{textNode=matchingNode.childNodes[s];if(typeof textNode.tagName==="undefined")
{matchingNode=textNode;break;}}
if(textNode===null)
{textNode=o.toNode.ownerDocument.createTextNode("");matchingNode.appendChild(textNode);matchingNode=textNode;}}
if(matchingNode.nodeValue!==o.fromNode.nodeValue&&(matchingNode.nodeValue===null||o.fromNode.nodeValue===null||matchingNode.nodeValue.toLowerCase()!==o.fromNode.nodeValue.toLowerCase()))
{if(!o.compareOnly&&(o.fromNode.nodeValue===null||o.overideValue))
{matchingNode.nodeValue=o.fromNode.nodeValue;}
o.changesMade++;if(o.compareOnly)
{return o.changesMade;}}}
else
{var parentXpath=newXpath+"";var childCollection=null;var endNodeValueSaved=false;var temporaryFromNode=o.fromNode;while(matchingNode===null)
{var lastIndex=parentXpath.lastIndexOf('/');var lastNodeTag="";if(lastIndex>=0)
{lastNodeTag=parentXpath.substr(lastIndex+1).split("[")[0];parentXpath=parentXpath.substr(0,lastIndex);matchingNode=$sn(o.originalToNode,parentXpath);}
else
{matchingNode=o.toNode;}
o.changesMade++;if(o.compareOnly)
{return o.changesMade;}
var currentNode=o.toNode.ownerDocument.createElement(lastNodeTag);if(!endNodeValueSaved&&isTextnode)
{currentNode.appendChild(o.toNode.ownerDocument.createTextNode(temporaryFromNode.nodeValue));endNodeValueSaved=true;}
if(!isTextnode)
{var saCount=temporaryFromNode.attributes.length;for(var c=0;c<saCount;c++)
{var sa=temporaryFromNode.attributes[c];currentNode.setAttribute(sa.name,sa.value);}}
if(childCollection!==null)
{currentNode.appendChild(childCollection);}
childCollection=currentNode;temporaryFromNode=temporaryFromNode.parentNode;}
if(!o.compareOnly&&childCollection)
{matchingNode.appendChild(childCollection);}}}
return o.changesMade;}
function MergeXmlNodeCollections(nodeCollection1,nodeCollection2)
{var mergedCollection=[];for(var l=0;l<nodeCollection1.length;l++)
{mergedCollection.push(nodeCollection1[l]);}
for(var l=0;l<nodeCollection2.length;l++)
{mergedCollection.push(nodeCollection2[l]);}
return mergedCollection;}
function CompareXmlNodes(nodeA,nodeB)
{var options={fromNode:nodeA,toNode:nodeB,compareOnly:true};var changes=MergeXmlNodes(options);if(changes!==0)
{return false;}
var options={fromNode:nodeB,toNode:nodeA,compareOnly:true};changes=MergeXmlNodes(options);if(changes!==0)
{return false;}
return true;}
function populateIdentifyingNode(o,deltaNode,currentNode)
{if(o.isIdentifyingPath)
{if(checkExists(o.identifyingAttributes))
{for(var i=0;i<o.identifyingAttributes.length;i++)
{var attributeName=o.identifyingAttributes[i];var currentNodeAttribute=currentNode.getAttribute(attributeName);if(checkExists(currentNodeAttribute))
{deltaNode.setAttribute(attributeName,currentNodeAttribute);}}}
if(checkExists(o.identifyingNodes))
{for(var i=0;i<o.identifyingNodes.length;i++)
{var nodeName=o.identifyingNodes[i];var currentNodeNode=currentNode.selectSingleNode(nodeName);if(checkExists(currentNodeNode))
{deltaNode.appendChild(currentNodeNode.cloneNode(true));}}}}}
function FindXmlDelta(options)
{if(!checkExists(options.overideValue))
{options.overideValue=false;}
if(!checkExists(options.compareOnly))
{options.compareOnly=false;}
var parentNode=options.toNode.parentNode;options.currentXpath="";if(!options.toNode.parentNode&&options.toNode.documentElement)
{options.originalToNode=options.toNode;options.toNode=options.toNode.documentElement;}
else if(options.toNode.parentNode)
{options.originalToNode=options.toNode.parentNode;}
else
{options.originalToNode=options.toNode;}
if(!options.fromNode.parentNode&&options.fromNode.documentElement)
{options.originalFromNode=options.fromNode;options.fromNode=options.fromNode.documentElement;}
else if(options.fromNode.parentNode)
{options.originalFromNode=options.fromNode.parentNode;}
else
{options.originalFromNode=options.fromNode;}
options.delta=parseXML("<Delta/>");var result=FindXmlDeltaInternal(options);if(result===null)
{return result;}
return result.cloneNode(true);}
function FindXmlDeltaInternal(o)
{var newXpath=_getCurrentNodeXpath(o);var deltaNode=null;if(o.fromNode.hasChildNodes())
{for(var s=0;s<o.fromNode.childNodes.length;s++)
{var currentFromNode=o.fromNode.childNodes[s];var options={fromNode:o.fromNode.childNodes[s],toNode:o.toNode,overideValue:o.overideValue,compareOnly:o.compareOnly,delta:o.delta,originalToNode:o.originalToNode,originalFromNode:o.originalFromNode,identifyingPath:o.identifyingPath,identifyingAttributes:o.identifyingAttributes,identifyingNodes:o.identifyingNodes,currentXpath:newXpath};var deltaChildren=FindXmlDeltaInternal(options);if(deltaChildren!=null)
{if(deltaNode===null)
{deltaNode=options.delta.createElement(o.fromNode.tagName);populateIdentifyingNode(o,deltaNode,o.fromNode);}
deltaNode.appendChild(deltaChildren);}}
if(typeof o.fromNode.attributes!=="undefined"&&o.fromNode.attributes!==null)
{var saCount=o.fromNode.attributes.length;for(var c=0;c<saCount;c++)
{var sa=o.fromNode.attributes[c];var thisNode=$sn(o.originalToNode,newXpath);if(!thisNode||thisNode.getAttribute(sa.name)!==sa.value)
{if(deltaNode==null)
{deltaNode=o.delta.createElement(o.fromNode.tagName);}
deltaNode.setAttribute(sa.name,sa.value);}}}}
else
{var isTextnode=(typeof o.fromNode.tagName==="undefined");var matchingNode=$sn(o.originalToNode,newXpath);if(matchingNode!=null)
{if(isTextnode)
{var textNode=null;for(var s=0;s<matchingNode.childNodes.length;s++)
{textNode=matchingNode.childNodes[s];if(typeof textNode.tagName==="undefined")
{matchingNode=textNode;break;}}}
if(matchingNode.nodeValue!==o.fromNode.nodeValue&&(matchingNode.nodeValue===null||o.fromNode.nodeValue===null||matchingNode.nodeValue.toLowerCase()!==o.fromNode.nodeValue.toLowerCase()))
{deltaNode=o.fromNode.cloneNode(true);}}
else
{deltaNode=o.fromNode.cloneNode(true);}}
return deltaNode;}
var prettyFormatOptions={indentChr:"\t",newLineChr:"\n"};function prettyFormatXml(xml,options)
{if(!checkExists(xml.parentNode)&&checkExists(xml.documentElement))
{xml=xml.documentElement;}
if(!checkExists(options))
{options=prettyFormatOptions;}
return prettyFormatNode(options,xml,"");}
function prettyFormatNode(options,node,indent)
{var childrenIndent=indent+options.indentChr;var returnValue="{0}<{1}".format(indent,node.tagName);var cl=node.attributes.length;for(var i=0;i<cl;i++)
{returnValue+=prettyFormatAttribute(node.attributes[i]);}
returnValue+=">{0}".format(options.newLineChr);var cl=node.childNodes.length;for(var i=0;i<cl;i++)
{var childNode=node.childNodes[i];if(childNode.nodeType===3||childNode.nodeType===4)
{returnValue+=prettyFormatTextNode(options,childNode,childrenIndent);}
else
{returnValue+=prettyFormatNode(options,childNode,childrenIndent);}}
returnValue+="{0}</{1}>{2}".format(indent,node.tagName,options.newLineChr);return returnValue;}
function prettyFormatAttribute(attribute)
{return" {0}={1}".format(attribute.name,attribute.value);}
function prettyFormatTextNode(options,node,indent)
{return"{0}{1}{2}".format(indent,node.nodeValue,options.newLineChr);}
function getNodeValue(path,node,valueIfMissing)
{var nodeValueString=valueIfMissing;if(checkExists(node))
{var nodeFromPath=node.selectSingleNode(path);if(checkExists(nodeFromPath))
{nodeValueString=nodeFromPath.text;}}
return nodeValueString;}
function getNodeAttribute(attribute,node,valueIfMissing,validationFunction)
{if(checkExists(node))
{var attributeVal=node.getAttribute(attribute);if(!checkExists(validationFunction))
{validationFunction=checkExists;}
if(validationFunction(attributeVal))
{return attributeVal;}}
return valueIfMissing;}
var _supportsDOMParser=null;function supportsDOMParser()
{if(_supportsDOMParser===null)
{_supportsDOMParser=(typeof window.DOMParser!=="undefined");if(_supportsDOMParser)
{var tmp=new DOMParser();var xml=tmp.parseFromString("<test/>","text/xml");_supportsDOMParser=(typeof xml.evaluate==="function");}}
return _supportsDOMParser;}
var _supportsActiveX=null;function supportsActiveX()
{if(_supportsActiveX===null)
{try
{var test=new ActiveXObject("Msxml2.DOMDocument.6.0");_supportsActiveX=true;}
catch(e)
{_supportsActiveX=false;}}
return _supportsActiveX;}
var _supportsNativeXPath=null;function supportsNativeXPath()
{if(_supportsNativeXPath===null)
{_supportsNativeXPath=false;try
{if(typeof(DOMParser)!=='undefined')
{var test=new DOMParser();var result=test.parseFromString('<root><node/><node/></root>','text/xml');var nodes=result.selectNodes('/root/node');}
_supportsNativeXPath=true;}
catch(e)
{}}
return _supportsNativeXPath;}
SourceCode.Forms.Xml.smoXmlToObjects=function(xmlDoc)
{var smartObjects=[];var items=xmlDoc.selectNodes("Items/Item");for(var i=0;i<items.length;i++)
{var item=items[i];var smoId=item.getAttribute("Guid");var itemType=item.getAttribute("ItemType");var subType=item.getAttribute("SubType");var nameNode=item.selectSingleNode("Name");var displayNameNode=item.selectSingleNode("DisplayName");var validationStatus=item.getAttribute("ValidationStatus");var validationMessages=item.getAttribute("validationMessages");var name="";var displayName="";if(checkExists(nameNode))
{name=nameNode.text;}
if(checkExists(displayNameNode))
{displayName=displayNameNode.text;}
var smo=new SourceCode.Forms.Types.SmartObject({id:smoId,name:name,displayName:displayName,validationStatus:validationStatus,validationMessages:validationMessages,subType:subType});var propertiesArr=item.selectNodes("Items/Item");SourceCode.Forms.Xml.addSmoPropertiesAndMethodsFromXml(propertiesArr,smo);smartObjects.push(smo);}
return smartObjects;}
SourceCode.Forms.Xml.addSmoPropertiesAndMethodsFromXml=function(propertiesArr,smartObject)
{var properties=[];for(var i=0;i<propertiesArr.length;i++)
{var item=propertiesArr[i];var itemType=item.getAttribute("ItemType");var subType=item.getAttribute("SubType");var nameNode=item.selectSingleNode("Name");var displayNameNode=item.selectSingleNode("DisplayName");var validationStatus=item.getAttribute("ValidationStatus");var validationMessages=item.getAttribute("validationMessages");var name="";var displayName="";if(checkExists(nameNode))
{name=nameNode.text;}
if(checkExists(displayNameNode))
{displayName=displayNameNode.text;}
var options={name:name,displayName:displayName,validationStatus:validationStatus,validationMessages:validationMessages,subType:subType};var smoItem;if(itemType&&itemType.toUpperCase()==="METHOD")
{smartObject.methods.add(new SourceCode.Forms.Types.SmartObjectMethod(options));}
if(itemType&&itemType.toUpperCase()==="OBJECTPROPERTY")
{smartObject.objectProperties.add(new SourceCode.Forms.Types.SmartObjectProperty(options));}}}
$.parseXML=function(data)
{var xml,tmp;try
{if(!supportsActiveX())
{tmp=new DOMParser();xml=tmp.parseFromString(data,"text/xml");}
else
{xml=new ActiveXObject("Msxml2.DOMDocument.6.0");xml.async="false";xml.preserveWhiteSpace=true;xml.loadXML(data);}}
catch(e)
{xml=undefined;}
if(!xml||!xml.documentElement||xml.getElementsByTagName("parsererror").length)
{if(checkExists(data)&&typeof data.toString==="function")
{jQuery.error("Invalid XML: "+data);}
else
{jQuery.error('Invalid XML (cannot represent object as string).');}}
return xml;};$.ajaxSettings.converters["text xml"]=$.parseXML;