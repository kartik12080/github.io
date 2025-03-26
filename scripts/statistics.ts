interface StatisticsData {
    monthlyData: {
        labels: string[];
        volunteers: number[];
    };
    eventTypes: {
        labels: string[];
        data: number[];
        colors: string[];
    };
    yearlyGrowth: {
        labels: string[];
        volunteers: number[];
    };
    activities?: {
        name?: string[];
        participants?: number[];
        hours?: number[];
    };
    summaryStats: {
        totalVolunteers: number;
        totalEvents: number;
        avgHours: number;
        satisfaction: number;
    };
}

async function loadStatistics(): Promise<StatisticsData> {
    try {
        const response = await fetch('../data/statistics.json');
        if (!response.ok) throw new Error('Failed to load statistics');
        return await response.json();
    } catch (error) {
        console.error('Error loading statistics:', error);
        throw error;
    }
}

function updateSummaryStats(data: StatisticsData) {
    const totalVolunteers = document.getElementById('totalVolunteers');
    const totalEvents = document.getElementById('totalEvents');
    const avgHours = document.getElementById('avgHours');
    const satisfaction = document.getElementById('satisfaction');

    if (totalVolunteers) totalVolunteers.textContent = data.summaryStats.totalVolunteers.toString();
    if (totalEvents) totalEvents.textContent = data.summaryStats.totalEvents.toString();
    if (avgHours) avgHours.textContent = data.summaryStats.avgHours.toFixed(1);
    if (satisfaction) satisfaction.textContent = `${data.summaryStats.satisfaction}%`;
}

function renderMonthlyBars(data: StatisticsData) {
    const container = document.getElementById('monthlyBars');
    if (!container || !data.monthlyData?.labels) return;

    const maxValue = Math.max(...data.monthlyData.volunteers);

    let html = '';
    data.monthlyData.labels.forEach((month, index) => {
        const value = data.monthlyData.volunteers[index];
        const percentage = (value / maxValue) * 100;

        html += `
            <div class="bar-container">
                <div class="bar-label">${month}</div>
                <div class="bar">
                    <div class="bar-fill" data-width="${percentage}%" style="width: 0"></div>
                    <div class="bar-value">${value}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html || '<div class="text-center py-3">No monthly data available</div>';
}

function renderEventTypes(data: StatisticsData) {
    const pieCenter = document.getElementById('pieCenterValue');
    const legendContainer = document.getElementById('pieLegend');

    if (!data.eventTypes?.labels || !legendContainer) return;

    const total = data.eventTypes.data.reduce((sum, val) => sum + val, 0);
    if (pieCenter) pieCenter.textContent = `${total} Events`;

    let legendHtml = '';
    data.eventTypes.labels.forEach((label, index) => {
        const value = data.eventTypes.data[index];
        const percentage = Math.round((value / total) * 100);
        const color = data.eventTypes.colors[index];

        legendHtml += `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${color}"></div>
                <div>${label} (${percentage}%)</div>
            </div>
        `;
    });

    legendContainer.innerHTML = legendHtml || '<div>No event type data available</div>';
}

function renderYearlyGrowth(data: StatisticsData) {
    const container = document.getElementById('yearlyBars');
    if (!container || !data.yearlyGrowth?.labels) return;

    const maxValue = Math.max(...data.yearlyGrowth.volunteers);

    let html = '';
    data.yearlyGrowth.labels.forEach((year, index) => {
        const value = data.yearlyGrowth.volunteers[index];
        const percentage = (value / maxValue) * 100;

        html += `
            <div class="bar-container">
                <div class="bar-label">${year}</div>
                <div class="bar">
                    <div class="bar-fill" data-width="${percentage}%" style="width: 0"></div>
                    <div class="bar-value">${value}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html || '<div class="text-center py-3">No yearly data available</div>';
}

function renderActivitiesTable(data: StatisticsData) {
    const tableBody = document.querySelector('#activitiesTable tbody');
    if (!tableBody) return;

    // Check if activities data exists and has all required arrays
    if (!data.activities || !data.activities.name || !data.activities.participants || !data.activities.hours) {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center">No activity data available</td></tr>';
        return;
    }

    // Check if all arrays have the same length
    if (data.activities.name.length !== data.activities.participants.length ||
        data.activities.name.length !== data.activities.hours.length) {
        tableBody.innerHTML = '<tr><td colspan="3" class="text-center">Incomplete activity data</td></tr>';
        return;
    }

    let html = '';
    data.activities.name.forEach((name, index) => {
        html += `
            <tr>
                <td>${name}</td>
                <td>${data.activities?.participants?.[index] ?? 'N/A'}</td>
                <td>${data.activities?.hours?.[index] ?? 'N/A'}</td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
    // Only run this check if we're on the statistics page
    if (window.location.pathname.includes('/statistics')) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = '/views/login.html?redirect=/statistics';
            return;
        }
    }

    try {
        const data = await loadStatistics();
        updateSummaryStats(data);
        renderMonthlyBars(data);
        renderEventTypes(data);
        renderYearlyGrowth(data);
        renderActivitiesTable(data);

        setTimeout(() => {
            document.querySelectorAll('.bar-fill').forEach(bar => {
                const htmlBar = bar as HTMLElement;
                const targetWidth = htmlBar.dataset.width || '0%';
                htmlBar.style.width = '0';
                setTimeout(() => {
                    htmlBar.style.width = targetWidth;
                }, 10);
            });
        }, 100);
    } catch (error) {
        console.error('Failed to load statistics:', error);
        const errorElement = document.getElementById('loadingError');
        if (errorElement) {
            errorElement.textContent = 'Failed to load statistics data. Please try again later.';
            errorElement.style.display = 'block';
        }
    }
});