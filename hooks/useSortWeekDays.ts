type SorterType = {
    [key: string]: number;
};

export const sorter: SorterType = {
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
    Domingo: 7,
};



function getSortWeekDays(days: string[]) {

    days.sort(function sortByDay(a, b) {
        let day1 = a.toLowerCase();
        let day2 = b.toLowerCase();
        return sorter[day1] - sorter[day2];
    }).reverse();


    return days
}

export default getSortWeekDays