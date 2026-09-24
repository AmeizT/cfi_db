import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ReportProgressRail } from '../monthly-report/ReportProgressRail'
import { REPORT_WIZARD_SECTIONS, type ReportWizardSectionSnapshot } from '../../report-wizard/config/report-types'

const statuses: ReportWizardSectionSnapshot['status'][] = ['completed', 'submitted', 'no_activity', 'not_required', 'skipped', 'in_progress', 'pending']
const snapshots = REPORT_WIZARD_SECTIONS.map((section, index) => ({ name: section.backendId, status: statuses[index] }))

for (const current of REPORT_WIZARD_SECTIONS) {
    test(`${current.label}: only the current row is highlighted, with unchanged counts and route context`, () => {
        const html = renderToStaticMarkup(createElement(ReportProgressRail, {
            steps: REPORT_WIZARD_SECTIONS, current, sections: snapshots,
            periodLabel: 'September 2026', method: 'upload', uploadType: 'excel',
            reportId: 127, amendmentContext: 'reopened', className: 'h-full',
        }))
        const links = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) ?? []
        assert.equal(links.length, REPORT_WIZARD_SECTIONS.length)
        const active = links.filter(link => link.includes('aria-current="step"'))
        assert.equal(active.length, 1)
        assert.ok(active[0].includes('bg-primary/10'))
        assert.ok(active[0].includes('bg-primary text-primary-foreground'))
        assert.equal(links.filter(link => link.includes('bg-primary/10')).length, 1)
        assert.match(html, /<progress[^>]*max="7"[^>]*value="5"/)
        assert.match(html, /5 of 7 sections resolved/)
        for (const link of links) {
            const href = link.match(/href="([^"]+)"/)![1].replaceAll('&amp;', '&')
            const url = new URL(href, 'https://workspace.test')
            assert.equal(url.pathname, '/record-center')
            assert.equal(url.searchParams.get('method'), 'upload')
            assert.equal(url.searchParams.get('upload_type'), 'excel')
            assert.equal(url.searchParams.get('report_id'), '127')
            assert.equal(url.searchParams.get('amendment_context'), 'reopened')
        }
        assert.match(html, /Reporting guidance/)
        assert.ok(html.indexOf('Reporting guidance') > html.indexOf('</ol>'))
    })
}
