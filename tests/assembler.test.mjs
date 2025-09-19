i// tests/assembler.test.mjs
import { assemble, buildComponentTree, getPropsFromStore } from '../src/assembler.js';
import N3 from 'n3'; // Import the default object

const { N3, DataFactory } = n3; // Destructure from the imported object

describe('Assembler Core Logic', () => {
    let store;

    beforeEach(() => {
        store = new N3.Store();
        store.addQuad(DataFactory.namedNode('ex:OntologyEditorApp'), DataFactory.namedNode('mt-ao:isComposedOf'), DataFactory.namedNode('ex:SidebarPanel'));
        store.addQuad(DataFactory.namedNode('ex:SidebarPanel'), DataFactory.namedNode('mt-ao:hasName'), DataFactory.literal('Sidebar'));
        store.addQuad(DataFactory.namedNode('ex:SidebarPanel'), DataFactory.namedNode('mt-ao:hasView'), DataFactory.literal('SidebarView.js'));
        store.addQuad(DataFactory.namedNode('ex:SidebarPanel'), DataFactory.namedNode('mt-ao:isComposedOf'), DataFactory.namedNode('ex:AddEntityForm'));
        store.addQuad(DataFactory.namedNode('ex:AddEntityForm'), DataFactory.namedNode('mt-ao:hasName'), DataFactory.literal('AddEntityForm'));
        store.addQuad(DataFactory.namedNode('ex:AddEntityForm'), DataFactory.namedNode('mt-ao:hasLabel'), DataFactory.literal('Add New Entity'));
        store.addQuad(DataFactory.namedNode('ex:AddEntityForm'), DataFactory.namedNode('mt-ao:hasHandlerFor'), DataFactory.literal('onFormSubmit'));
    });

    test('should correctly build a component tree from a triple store', () => {
        const componentTree = buildComponentTree(store, DataFactory.namedNode('ex:SidebarPanel'));

        expect(componentTree.name).toBe('Sidebar');
        expect(componentTree.children).toHaveLength(1);
        expect(componentTree.children[0].name).toBe('AddEntityForm');
        expect(componentTree.children[0].props.label).toBe('Add New Entity');
    });

    test('should correctly map RDF properties to a JavaScript props object', () => {
        const props = getPropsFromStore(store, DataFactory.namedNode('ex:AddEntityForm'));

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
