// tests/assembler.test.mjs
import { assemble, buildComponentTree, getPropsFromStore } from '../src/assembler.js';
import { N3, DataFactory } from 'n3';

const { namedNode, literal } = DataFactory;

describe('Assembler Core Logic', () => {
    let store;

    beforeEach(() => {
        store = new N3.Store();
        store.addQuad(namedNode('ex:OntologyEditorApp'), namedNode('mt-ao:isComposedOf'), namedNode('ex:SidebarPanel'));
        store.addQuad(namedNode('ex:SidebarPanel'), namedNode('mt-ao:hasName'), literal('Sidebar'));
        store.addQuad(namedNode('ex:SidebarPanel'), namedNode('mt-ao:hasView'), literal('SidebarView.js'));
        store.addQuad(namedNode('ex:SidebarPanel'), namedNode('mt-ao:isComposedOf'), namedNode('ex:AddEntityForm'));
        store.addQuad(namedNode('ex:AddEntityForm'), namedNode('mt-ao:hasName'), literal('AddEntityForm'));
        store.addQuad(namedNode('ex:AddEntityForm'), namedNode('mt-ao:hasLabel'), literal('Add New Entity'));
        store.addQuad(namedNode('ex:AddEntityForm'), namedNode('mt-ao:hasHandlerFor'), literal('onFormSubmit'));
    });

    test('should correctly build a component tree from a triple store', () => {
        const componentTree = buildComponentTree(store, namedNode('ex:SidebarPanel'));

        expect(componentTree.name).toBe('Sidebar');
        expect(componentTree.children).toHaveLength(1);
        expect(componentTree.children[0].name).toBe('AddEntityForm');
        expect(componentTree.children[0].props.label).toBe('Add New Entity');
    });

    test('should correctly map RDF properties to a JavaScript props object', () => {
        const props = getPropsFromStore(store, namedNode('ex:AddEntityForm'));

        expect(props.label).toBe('Add New Entity');
        expect(props.onClick).toBe('handleonFormSubmit');
        expect(props.viewPath).toBe(undefined);
    });

    test('should assemble a complete application tree from a manifest', async () => {
        const manifestTTL = `@prefix : <http://example.com/data#> .
        @prefix mt-ao: <http://www.melon-toolkit.org/ontology/assembly#> .
        @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
        
        :TestApp rdf:type mt-ao:Application ;
            mt-ao:isComposedOf :TestComponent .
        
        :TestComponent rdf:type mt-ao:Component ;
            mt-ao:hasName "TestComponent" ;
            mt-ao:hasLabel "Hello" ;
            mt-ao:hasView "TestView.js" .
        `;
        
        const componentTree = await assemble(manifestTTL, {});
        
        expect(componentTree.name).toBe('TestComponent');
        expect(componentTree.props.label).toBe('Hello');
        expect(componentTree.props.viewPath).toBe('TestView.js');
    });
});
