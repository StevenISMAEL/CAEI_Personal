const auditEvent = (event) => {
    switch (event) {
        case "created":
            return "creado";
        case "updated":
            return "actualizado";
        case "deleted":
            return "eliminado";
        case "restored":
            return "restaurado";
        case "role_change":
            return "cambio de rol";
        default:
            return event;
    }
};

export const transformAuditData = (audits) => {
    const data = {
        labels: [],
        datasets: {
            creado: [],
            actualizado: [],
            eliminado: [],
            restaurado: [],
            "cambio de rol": [],
        },
    };

    const userTableMap = {};

    audits.forEach((audit) => {
        const user = audit.user.username;
        const table = audit.modified_table.table_name;
        const event = auditEvent(audit.event);

        const key = `${user} - ${table}`;

        if (!userTableMap[key]) {
            userTableMap[key] = {
                creado: 0,
                actualizado: 0,
                eliminado: 0,
                restaurado: 0,
                "cambio de rol": 0,
            };
            data.labels.push(key);
        }

        userTableMap[key][event] += 1;
    });

    data.labels.forEach((label) => {
        data.datasets.creado.push(userTableMap[label].creado);
        data.datasets.actualizado.push(userTableMap[label].actualizado);
        data.datasets.eliminado.push(userTableMap[label].eliminado);
        data.datasets.restaurado.push(userTableMap[label].restaurado);
        data.datasets["cambio de rol"].push(
            userTableMap[label]["cambio de rol"],
        );
    });

    return data;
};

export const transformRoleActivityData = (audits) => {
    const roleActivity = {};
    audits.forEach((audit) => {
        audit.user_roles.forEach((role) => {
            if (!roleActivity[role]) {
                roleActivity[role] = 0;
            }
            roleActivity[role]++;
        });
    });

    return {
        labels: Object.keys(roleActivity),
        datasets: [
            {
                data: Object.values(roleActivity),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            },
        ],
    };
};

export const transformEntityActivityData = (audits) => {
    const entityActivity = {};
    audits.forEach((audit) => {
        const entity = audit.auditable_type.split("\\").pop();
        if (!entityActivity[entity]) {
            entityActivity[entity] = 0;
        }
        entityActivity[entity]++;
    });

    return {
        labels: Object.keys(entityActivity),
        datasets: [
            {
                label: "Actividad por Entidad",
                data: Object.values(entityActivity),
                backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
        ],
    };
};

export const transformTimelineData = (audits) => {
    const timeline = {};
    audits.forEach((audit) => {
        const date = audit.created_at.split("T")[0];
        if (!timeline[date]) {
            timeline[date] = 0;
        }
        timeline[date]++;
    });

    return {
        labels: Object.keys(timeline).sort(),
        datasets: [
            {
                label: "Actividad Diaria",
                data: Object.keys(timeline)
                    .sort()
                    .map((key) => timeline[key]),
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
            },
        ],
    };
};

export const transformHeatmapData = (audits) => {
    const heatmapData = {};
    const users = new Set();
    const tables = new Set();

    audits.forEach((audit) => {
        const user = audit.user.name;
        const table = audit.modified_table.table_name;
        users.add(user);
        tables.add(table);

        if (!heatmapData[user]) {
            heatmapData[user] = {};
        }
        if (!heatmapData[user][table]) {
            heatmapData[user][table] = 0;
        }
        heatmapData[user][table]++;
    });

    return {
        users: Array.from(users),
        tables: Array.from(tables),
        data: Object.keys(heatmapData).flatMap((user) =>
            Object.keys(heatmapData[user]).map((table) => ({
                x: table,
                y: user,
                v: heatmapData[user][table],
            })),
        ),
    };
};
