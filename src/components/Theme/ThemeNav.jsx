import React from 'react';
import { themenavbar } from '../../utils/data';
import { Link } from 'react-router-dom';

const ThemeNav = ({ onSelectTheme }) => {
  return (
    <div className="px-2">
      <div className="w-full h-[full] mt-14">
        <ul className="flex justify-between items-center">
          {themenavbar.map((menu, idx) => (
            <li
              key={idx}
              className="border border-gray-300 rounded-md p-2 flex justify-center hover:bg-cyan-100"
              style={{ minWidth: '120px' }}
            >
              <Link to="#" onClick={() => onSelectTheme(menu)}>
                {menu.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ThemeNav;
