import { html, renderTitle } from './util.js';

function info(name, content) {
  return html('tr', { class: 'border border-zinc-400' }, [
    html('td', { class: 'px-2 py-0.5 w-48 text-right' }, name + ':'),
    content ? html('td', { class: 'px-2 py-0.5' }, content)
            : html('td', { class: 'px-2 py-0.5 text-zinc-400' }, 'N/A')
  ]);
}

export class Overview {

  constructor(container, spec, plan) {
    this.container = container;
    this.spec = spec;
    this.plan = plan;

    this.container.append(
      html('table', { class: 'w-full' }, [
        html('tr', { class: 'border border-zinc-400 bg-zinc-300' }, [
          html('td', {
            colspan: '2',
            class: 'p-2 font-bold'
          }, 'Student Information')
        ]),
        info('Student Name', this.plan.studentName),
        info('ALEKS Score', this.plan.aleks?.toString()),
        info('Innovation Academy', this.plan.innovationAcademy ? 'Yes' : 'No'),
        info('Total Credits', [
          html('b', null, this.plan.credits.toString()),
          '/120'
        ]),
        info('Total Words', this.plan.words.toString())
      ])
    );

    this.container.append(
      this.table = html('table', { class: 'w-full' })
    );

    for (const block of spec.block) {
      this.table.append(
        html('tr', null, [
          html('td', {
            colspan: '2',
            class: 'border border-zinc-400 p-2 bg-zinc-300 font-bold'
          }, block.title)
        ])
      );
      for (const entry of block.entry) {
        const ok = this.plan.test(entry);
        this.table.append(
          html('tr', {
            class: `border border-zinc-400 ${ok ? 'bg-green-200' : 'bg-red-200'}`
          }, [
            html('td', { class: 'px-2 py-0.5' }, [renderTitle(entry.title)]),
            html('td', { class: 'px-2 py-0.5' }, ok ? 'Yes' : 'No')
          ])
        );
      }
    }
  }

  _addBlock(title) {
    const block = html('div', { class: 'bg-zinc-100' }, [
      html('div', { class: 'px-2 py-0.5 bg-zinc-300 font-bold' }, title)
    ]);
    this.container.append(block);
    return block;
  }

}
