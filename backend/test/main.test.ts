import { Article, filterAndSort } from '../src/main';

let articles: Article[];

describe('filterAndSort function', () => {
    
    it('reuturns emtpy when called with empty', () => {
        articles = [];
        expect(filterAndSort(articles)).toEqual([]);
    });

    it('filters out articles that has missing values', () => {        
        const a = {title:'A', link: 'A', image: 'A', source: 'A', time: 'Invalid Date'};
        const b = {title:'B', link: 'B', image: 'B', source: 'B', time: ''};
        const c = {title:'', link: '', image: '', source: '', time: ''};
        const d = {title:'D', link: '', image: '', source: 'D', time: 'Invalid Date'};
        articles = [a, b, c, d];
        const filtered = filterAndSort(articles);
        
        expect(filtered).toContainEqual(a);
        expect(filtered).not.toContain(b);
        expect(filtered).not.toContain(c);
        expect(filtered).not.toContain(d);
    })


});