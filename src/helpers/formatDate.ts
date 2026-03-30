
    export const formatDate = (date : Date | null) : string | null => {

            if(!date) return null;
            const parsed = date instanceof Date ? date : new Date(date)



            const options : Intl.DateTimeFormatOptions = {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
            };

            return new Intl.DateTimeFormat("en-GB", options).format(parsed);
    }