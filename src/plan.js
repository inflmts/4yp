import { html, renderId, renderTitle } from './util.js';

class Course {

  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.credits = data.credits;
    this.words = data.words ?? 0;
    this.reason = data.reason ?? null;
    this.grade = data.grade ?? null;
    this.prereqs = data.prereqs ?? null;

    this.container = html('tr', {
      class: 'border border-zinc-400 group-hover:bg-yellow-100 group-hover:hover:bg-yellow-300'
    }, [
      html('td', { class: 'px-2 py-0.5 w-24' }, [renderId(this.id)]),
      this.nameElement =
      html('td', { class: 'px-2 py-0.5' }, [renderTitle(this.name)]),
      html('td', { class: 'px-2 py-0.5 text-right' }, this.credits.toString())
    ]);

    if (this.prereqs) {
      for (const prereq of this.prereqs) {
        this.nameElement.append(' ', html('span', {
          class: 'inline-block px-1 bg-blue-300/50 text-xs'
        }, [renderId(prereq)]));
      }
    }

    if (this.words)
      this.tag(this.words.toString());

    if (this.reason)
      for (const reason of this.reason)
        this.tag(reason);
  }

  tag(tag) {
    this.nameElement.append(' ', html('span', {
      class: 'inline-block px-1 bg-black/10 text-xs'
    }, tag));
  }

}

class Semester {

  constructor(name, data, min = 12, max = 18) {
    this.courses = [];
    this.min = min;
    this.max = max;
    this.credits = 0;
    this.words = 0;

    this.container = html('div', { class: 'group contents' }, [
      this.bar = html('tr', {
        class: 'border border-zinc-400 bg-zinc-100 group-hover:bg-yellow-200'
      }, [
        html('td', { colspan: '2', class: 'px-2 py-0.5' }, name),
        this.creditsElement =
        html('td', { class: 'px-2 py-0.5 text-right font-bold' })
      ]),
    ]);

    if (data) {
      for (const c of data) {
        const course = new Course(c);
        this.courses.push(course);
        this.container.append(course.container);
        this.credits += course.credits;
        this.words += course.words;
      }
    }

    if (this.credits > 0) {
      if (this.credits < this.min || this.credits > this.max)
        this.creditsElement.classList.add('text-red-500');
      this.creditsElement.textContent = this.credits.toString();
    }
  }

}

export class Plan {

  constructor(container, data) {
    this.container = container;
    this.semesters = [];
    this.credits = 0;
    this.words = 0;

    this.studentName = data.name;
    this.aleks = data.aleks ?? null;
    this.innovationAcademy = data['innovation-academy'] ?? false;
    this.initialYear = data.start;
    this.yearCount = 4;

    this.container.append(
      this.table = html('table', { class: 'w-full' })
    );
    this._addBlock('Transfer', [
      new Semester('High School', data.transfer, 0, Infinity)
    ]);
    for (let i = 0; i < this.yearCount; i++) {
      const year = this.initialYear + i;
      this._addBlock(`Year ${i + 1}`, [
        new Semester(`Fall ${year}`, data[`${i + 1}fa`]),
        new Semester(`Spring ${year + 1}`, data[`${i + 1}sp`]),
        new Semester(`Summer ${year + 1}`, data[`${i + 1}su`], 8)
      ]);
    }
  }

  _addBlock(name, semesters) {
    this.table.append(html('tr', null, [
      html('td', {
        colspan: '3',
        class: 'border border-zinc-400 bg-zinc-300 p-2 font-bold'
      }, name)
    ]));
    for (const semester of semesters) {
      this.semesters.push(semester);
      this.table.append(semester.container);
      this.credits += semester.credits;
      this.words += semester.words;
    }
  }

  find(pred, tag) {
    for (const semester of this.semesters) {
      for (const course of semester.courses) {
        if (pred(course)) {
          if (tag)
            course.tag(tag);
          return course;
        }
      }
    }
  }

  test(test, tag = test.tag) {
    if (test.credits) {
      console.warn(`Minimum credit testing is not implemented yet.`);
      return false;
    }

    switch (test.type) {
      case 'reason': {
        return !!this.find(course => course.reason && course.reason.includes(test.reason), tag);
      }
      case 'course': {
        return !!this.find(course => course.id === test.course, tag);
      }
      case 'and': {
        for (const operand of test.operands)
          if (!this.test(operand, tag))
            return false;
        return true;
      }
      case 'or': {
        for (const operand of test.operands)
          if (this.test(operand, tag))
            return true;
        return false;
      }
      default: {
        console.warn(`Unrecognized test type '${test.type}'`);
        return false;
      }
    }
  }

}
