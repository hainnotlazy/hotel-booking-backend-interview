import { Injectable } from "@nestjs/common";
import { DOMParser } from "xmldom";

interface XmlNode {
	[key: string]: any;
}

@Injectable()
export class ParseXmlService {
	parseXml(xmlString: string): XmlNode | null {
		const trimmedXmlString = xmlString.trim();
		const parser = new DOMParser();
		const xmlDoc = parser.parseFromString(trimmedXmlString, "text/xml");

		const rootElement = xmlDoc.documentElement;
		const result: XmlNode = {};
		result[rootElement.tagName] = this.traverseNode(rootElement);

		return result;
	}

	traverseNode(node: Element): XmlNode | string {
		let result: XmlNode = {};

		// Process attributes
		if (node.attributes) {
			for (let i = 0; i < node.attributes.length; i++) {
				const attr = node.attributes[i];
				result[`@_${attr.name}`] = attr.value;
			}
		}

		// Process child nodes
		for (let i = 0; i < node.childNodes.length; i++) {
			const child = node.childNodes[i];
			if (
				node.attributes.length === 0 &&
				child.nodeType === child.TEXT_NODE &&
				child.nodeValue?.trim()
			) {
				return child.nodeValue.trim();
			} else if (child.nodeType === child.TEXT_NODE && child.nodeValue?.trim()) {
				// Handle text content in mixed content model
				if (!result["#text"]) {
					result["#text"] = child.nodeValue.trim();
				} else {
					result["#text"] += ` ${child.nodeValue.trim()}`;
				}
			} else if (child.nodeType === child.ELEMENT_NODE) {
				const childNode = child as Element;
				const childTagName = childNode.tagName;

				if (result[childTagName]) {
					if (!Array.isArray(result[childTagName])) {
						result[childTagName] = [result[childTagName]];
					}
					result[childTagName].push(this.traverseNode(childNode));
				} else {
					result[childTagName] = this.traverseNode(childNode);
				}
			}
		}

		return result;
	}
}
