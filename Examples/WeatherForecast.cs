using System;
using System.Collections.Generic;

namespace N1mbly.Examples
{
    public class Nested2
    {
        public string First { get; set; }
        public string Second { get; set; }
        public double Third { get; set; }
        public float Fourth { get; set; }
        public List<string> EndString { get; set; }
    }

    public class Nested1
    {
        public string First { get; set; }
        public string Second { get; set; }
        public char Third { get; set; }
        public Nested2 Nested2 { get; set; }
    }

    public class WeatherForecast
    {
        public DateTime Date { get; set; }

        public int TemperatureC { get; set; }

        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

        public string Summary { get; set; }
        public Nested1 Nested1 { get; set; }

        public string GetName()
        {
            return "Name";
        }
    }
}
